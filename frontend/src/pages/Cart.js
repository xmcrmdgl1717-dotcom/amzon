import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { validateCoupon } from '../api'; // 👈 确保你已经在 api.js 中写了这个方法

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    clearCart,
    checkout 
  } = useCart();

  // 结账弹窗状态
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👈 优惠券状态
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 35 ? 0 : 5.99; // Free shipping over $35
  // 👈 最终总价 = 原总价 - 折扣 (确保不为负数)
  const finalTotal = Math.max(0, subtotal + tax + shipping - discount);

  // 👈 应用优惠券逻辑
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true);
    setCouponError('');
    try {
      // 调用后端接口校验，传入购物车原价（不含税和运费）
      const res = await validateCoupon(couponCode, subtotal);
      setDiscount(res.discountAmount);
    } catch (err) {
      setCouponError(err.message);
      setDiscount(0);
    } finally {
      setIsValidating(false);
    }
  };

  // 提交订单逻辑
  const handleOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 将 couponCode 一并传给 checkout 方法
      await checkout({ 
        customerName: form.name, 
        customerEmail: form.email, 
        shippingAddr: form.address 
      }, couponCode);
      
      alert('🎉 Order submitted successfully! Waiting for admin review.');
      setShowCheckout(false);
      setForm({ name: '', email: '', address: '' });
      setCouponCode('');
      setDiscount(0);
    } catch (err) {
      alert('Order failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 空购物车视图
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <Link to="/" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-6 rounded-md">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 商品列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                <button onClick={clearCart} className="text-red-600 hover:text-red-800 text-sm font-medium">Clear Cart</button>
              </div>
              <div className="divide-y">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 订单摘要 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal ({cartItems.length} items)</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Tax</span><span>{formatPrice(tax)}</span></div>
                
                {/* 显示折扣 */}
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>
                </div>
              </div>
              <button onClick={() => setShowCheckout(true)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 rounded-md transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 结账弹窗 */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Checkout</h2>
            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required placeholder="John Doe" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" placeholder="john@example.com" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <textarea required rows="2" placeholder="123 Main St, City, Country" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea>
              </div>

              {/* 👈 优惠券输入区域 */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                    className="flex-1 border border-gray-300 rounded-l-md p-2 uppercase focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. SAVE10" 
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon} 
                    disabled={isValidating || !couponCode}
                    className="bg-gray-800 text-white px-4 rounded-r-md hover:bg-gray-900 disabled:opacity-50 transition-colors"
                  >
                    {isValidating ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                {discount > 0 && <p className="text-green-600 text-xs mt-1 font-bold">Coupon applied! You save {formatPrice(discount)}</p>}
              </div>

              {/* 支付汇总 */}
              <div className="bg-gray-50 p-3 rounded text-sm mb-2 border">
                <div className="flex justify-between mb-1"><span>Subtotal:</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between mb-1"><span>Tax & Shipping:</span><span>{formatPrice(tax + shipping)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600 mb-1"><span>Discount:</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Total to Pay:</span><span>{formatPrice(finalTotal)}</span></div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowCheckout(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 子组件：购物车单行
const CartItem = ({ item, updateQuantity, removeFromCart, formatPrice }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-shrink-0 self-center sm:self-start">
          <img
            src={item.image}
            alt={item.title}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/96x96?text=No+Image'; }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
          
          <div className="flex items-center mb-3 text-xs sm:text-sm">
            <span className="text-gray-600">In Stock</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-green-600">Prime eligible</span>
          </div>

          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
              <div className="flex items-center border border-gray-300 rounded">
                <button onClick={() => handleQuantityChange(item.quantity - 1)} className="px-2 sm:px-3 py-1 hover:bg-gray-100 text-sm">-</button>
                <span className="px-2 sm:px-3 py-1 border-l border-r border-gray-300 text-sm">{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.quantity + 1)} className="px-2 sm:px-3 py-1 hover:bg-gray-100 text-sm">+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
            </div>

            <div className="text-right">
              <div className="text-base sm:text-lg font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
              <div className="text-xs sm:text-sm text-gray-600">{formatPrice(item.price)} each</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

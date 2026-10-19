import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { validateCoupon } from '../api';
import AuthModal from '../components/AuthModal'; // 👈 引入登录弹窗

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, checkout } = useCart();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 登录弹窗状态
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('customer_info')));

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 35 ? 0 : 5.99;
  const finalTotal = Math.max(0, subtotal + tax + shipping - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true);
    setCouponError('');
    try {
      const res = await validateCoupon(couponCode, subtotal);
      setDiscount(res.discountAmount);
    } catch (err) {
      setCouponError(err.message);
      setDiscount(0);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setShowAuth(true); // 未登录，唤起登录弹窗
    } else {
      setShowCheckout(true); // 已登录，直接进入确认弹窗
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await checkout(couponCode);
      alert('🎉 Order submitted successfully!');
      setShowCheckout(false);
      setCouponCode('');
      setDiscount(0);
    } catch (err) {
      alert('Order failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <Link to="/" className="inline-block bg-yellow-400 py-3 px-6 rounded-md font-medium">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
                  <p className="text-lg font-bold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border rounded">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-gray-50">-</button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-gray-50">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-sm"><span>Tax</span><span>{formatPrice(tax)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>
              </div>
              <button onClick={handleCheckoutClick} className="w-full bg-yellow-400 py-3 rounded-md font-medium text-gray-900">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>

      {/* 已登录状态下的确认弹窗 */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Order</h2>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-4 text-sm text-blue-800">
              <p><strong>Deliver to:</strong> {user?.name}</p>
              <p>{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Address will be taken from your profile.</p>
            </div>
            
            {/* 优惠码输入 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Promo Code</label>
              <div className="flex">
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} className="flex-1 border rounded-l-md p-2 uppercase" placeholder="e.g. SAVE10" />
                <button type="button" onClick={handleApplyCoupon} disabled={isValidating} className="bg-gray-800 text-white px-4 rounded-r-md">Apply</button>
              </div>
              {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
            </div>

            <div className="bg-gray-50 p-3 rounded mb-4 font-bold flex justify-between">
              <span>Total to Pay:</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowCheckout(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleOrder} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">
                {isSubmitting ? 'Submitting...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 未登录时的登录弹窗 */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onLogin={(userData) => {
          setUser(userData);
          setShowAuth(false);
          setShowCheckout(true); // 登录成功后直接弹出确认框
        }} 
      />
    </div>
  );
};

export default Cart;

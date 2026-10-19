import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, checkout } = useCart();
  
  // 结账弹窗状态
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await checkout({ 
        customerName: form.name, 
        customerEmail: form.email, 
        shippingAddr: form.address 
      });
      alert('🎉 Order submitted successfully! Waiting for admin review.');
      setShowCheckout(false);
      setForm({ name: '', email: '', address: '' });
    } catch (err) {
      alert('Order failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 35 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

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
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                <button onClick={clearCart} className="text-red-600 hover:text-red-800 text-sm font-medium">Clear Cart</button>
              </div>
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border rounded">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                            <span className="px-3 py-1 border-l border-r">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-600 text-sm font-medium">Remove</button>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <div className="text-lg font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Tax</span><span>{formatPrice(tax)}</span></div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
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
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Checkout</h2>
            <form onSubmit={handleOrder} className="space-y-4">
              <input required placeholder="Full Name" className="w-full border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input required type="email" placeholder="Email" className="w-full border p-2 rounded" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <textarea required rows="3" placeholder="Shipping Address" className="w-full border p-2 rounded" value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea>
              <div className="flex justify-end space-x-3 mt-4">
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

export default Cart;

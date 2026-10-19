import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MyAccount() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('customer_info'));

  useEffect(() => {
    if (!user) {
      navigate('/'); // 未登录跳回首页
      return;
    }
    
    // 拉取当前用户的订单
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/customers/${user.id}/orders`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-end mb-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user.name}</p>
          </div>
          <Link to="/" className="text-blue-600 hover:underline text-sm font-medium">Back to Home</Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't placed any orders yet.</h3>
            <Link to="/" className="inline-block mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 px-6 rounded-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center border-b">
                  <div className="flex space-x-8 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs uppercase">Order Placed</span>
                      <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase">Total</span>
                      <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase">Order #</span>
                      <span className="font-medium">{order.orderNumber}</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">Items</h4>
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img src={item.product?.image} alt={item.product?.slug} className="w-16 h-16 object-cover rounded border" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product?.slug}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-bold text-gray-900">${(item.unitPrice * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

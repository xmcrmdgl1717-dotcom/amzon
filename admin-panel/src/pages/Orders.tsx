import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('admin_token');

  const loadOrders = () => {
    setLoading(true);
    fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const action = async (id: string, type: string) => {
    await fetch(`${API}/orders/${id}/${type}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    loadOrders();
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">订单列表</h2>
        <button onClick={loadOrders} className="text-sm text-blue-600 hover:underline">刷新</button>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-gray-500">加载中...</div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-4 border-b">订单号 / 时间</th>
              <th className="p-4 border-b">客户信息</th>
              <th className="p-4 border-b">商品明细</th>
              <th className="p-4 border-b">总金额</th>
              <th className="p-4 border-b">状态</th>
              <th className="p-4 border-b">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="hover:bg-gray-50 border-b">
                <td className="p-4 text-sm">
                  <div className="font-medium text-gray-900">{o.orderNumber}</div>
                  <div className="text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </td>
                <td className="p-4 text-sm">
                  <div className="font-medium text-gray-900">{o.customerName}</div>
                  <div className="text-gray-500">{o.customerEmail}</div>
                  <div className="text-gray-500 text-xs mt-1">{o.shippingAddr}</div>
                </td>
                <td className="p-4 text-sm">
                  <ul className="list-disc list-inside">
                    {o.items.map((item: any) => (
                      <li key={item.id}>商品 ID: {item.productId} × {item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 text-sm font-bold text-gray-900">${o.totalAmount.toFixed(2)}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    o.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                    o.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-sm space-x-2">
                  {o.status === 'PENDING_REVIEW' && (
                    <>
                      <button onClick={() => action(o.id, 'approve')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">通过</button>
                      <button onClick={() => action(o.id, 'reject')} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">驳回</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">暂无订单</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

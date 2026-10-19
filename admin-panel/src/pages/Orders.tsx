import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const token = localStorage.getItem('admin_token');

  const loadOrders = () => {
    setLoading(true);
    setError('');
    fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) throw new Error('网络请求失败，请检查后端是否正常');
        return res.json();
      })
      .then(data => {
        // 👈 安全兜底，确保是数组
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const action = async (id: string, type: string) => {
    try {
      await fetch(`${API}/orders/${id}/${type}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
      loadOrders();
      if (selectedOrder && selectedOrder.id === id) setSelectedOrder(null);
    } catch (err) {
      alert('操作失败');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">数据加载中...</div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded">出错了：{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-bold">订单列表</h2>
        <button onClick={loadOrders} className="text-sm text-blue-600">刷新</button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-sm border-b">
            <th className="p-4">订单号 / 时间</th><th className="p-4">客户信息</th><th className="p-4">总金额</th><th className="p-4">状态</th><th className="p-4">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o: any) => (
            <tr key={o.id} className="hover:bg-gray-50 border-b">
              <td className="p-4 text-sm">
                <div className="font-medium">{o.orderNumber}</div>
                <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
              </td>
              <td className="p-4 text-sm">
                <div>{o.customerName}</div>
                <div className="text-xs text-gray-500">{o.customerEmail}</div>
              </td>
              <td className="p-4 text-sm font-bold">${o.totalAmount?.toFixed(2) || '0.00'}</td>
              <td className="p-4 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  o.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                  o.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>{o.status}</span>
              </td>
              <td className="p-4 text-sm space-x-2">
                <button onClick={() => setSelectedOrder(o)} className="text-blue-600">查看</button>
                {o.status === 'PENDING_REVIEW' && (
                  <>
                    <button onClick={() => action(o.id, 'approve')} className="text-green-600">通过</button>
                    <button onClick={() => action(o.id, 'reject')} className="text-red-600">驳回</button>
                  </>
                )}
                {o.status === 'APPROVED' && <button onClick={() => action(o.id, 'ship')} className="text-blue-600">发货</button>}
              </td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">暂无订单数据</td></tr>}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between bg-gray-50">
              <h3 className="text-lg font-bold">订单详情：{selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-2xl text-gray-500">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <p><strong>收货人：</strong>{selectedOrder.customerName}</p>
              <p><strong>地址：</strong>{selectedOrder.shippingAddr}</p>
              <div className="border rounded divide-y">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="p-3 flex justify-between">
                    <span>商品ID: {item.productId} × {item.quantity}</span>
                    <span className="font-bold">${item.unitPrice?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

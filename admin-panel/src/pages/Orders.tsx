import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // 用于弹窗
  const token = localStorage.getItem('admin_token');

  const loadOrders = () => {
    setLoading(true);
    fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) throw new Error('获取失败');
        return res.json();
      })
      .then(data => { setOrders(data); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const action = async (id: string, type: string) => {
    try {
      await fetch(`${API}/orders/${id}/${type}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
      loadOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(null); // 如果当前在弹窗里操作，关闭弹窗
      }
    } catch (err) {
      alert('操作失败');
    }
  };

  if (loading) return <div className="p-8 text-center">加载中...</div>;
  if (error) return <div className="p-8 text-center text-red-500">错误：{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">订单列表</h2>
        <button onClick={loadOrders} className="text-sm text-blue-600 hover:underline">刷新</button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-sm">
            <th className="p-4 border-b">订单号 / 时间</th>
            <th className="p-4 border-b">客户信息</th>
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
                <div className="text-gray-500 text-xs">{new Date(o.createdAt).toLocaleString()}</div>
              </td>
              <td className="p-4 text-sm">
                <div className="font-medium text-gray-900">{o.customerName}</div>
                <div className="text-gray-500 text-xs">{o.customerEmail}</div>
              </td>
              <td className="p-4 text-sm font-bold text-gray-900">${o.totalAmount.toFixed(2)}</td>
              <td className="p-4 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  o.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                  o.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  {o.status}
                </span>
              </td>
              <td className="p-4 text-sm space-x-2">
                <button onClick={() => setSelectedOrder(o)} className="text-blue-600 hover:underline">查看</button>
                {o.status === 'PENDING_REVIEW' && (
                  <>
                    <button onClick={() => action(o.id, 'approve')} className="text-green-600 hover:underline">通过</button>
                    <button onClick={() => action(o.id, 'reject')} className="text-red-600 hover:underline">驳回</button>
                  </>
                )}
                {o.status === 'APPROVED' && (
                  <button onClick={() => action(o.id, 'ship')} className="text-blue-600 hover:underline">发货</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 订单详情弹窗 */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0">
              <h3 className="text-lg font-bold">订单详情：{selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-500 mb-1">收货信息</h4>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 text-sm">{selectedOrder.customerEmail}</p>
                  <p className="text-gray-600 text-sm mt-2">{selectedOrder.shippingAddr}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-500 mb-1">状态信息</h4>
                  <p className="font-medium">{selectedOrder.status}</p>
                  <p className="text-gray-600 text-sm">金额：${selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-500 mb-2">商品明细</h4>
                <div className="border rounded-md divide-y">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={item.product?.image} className="w-10 h-10 rounded object-cover border" />
                        <div>
                          <p className="font-medium text-sm">{item.product?.translations[0]?.title || 'Unknown Product'}</p>
                          <p className="text-xs text-gray-500">数量：{item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

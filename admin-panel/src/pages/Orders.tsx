import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const loadOrders = () => {
    setLoading(true);
    fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || '获取订单失败，请检查后端数据库');
        }
        return res.json();
      })
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const action = async (id: string, type: string) => {
    try {
      await fetch(`${API}/orders/${id}/${type}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadOrders();
    } catch (err) {
      alert('操作失败');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">加载中...</div>;
  
  // 👈 如果报错，展示报错信息，而不是白屏
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded">错误：{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">订单列表</h2>
        <button onClick={loadOrders} className="text-sm text-blue-600 hover:underline">刷新</button>
      </div>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-sm">
            <th className="p-4 border-b">订单号</th>
            <th className="p-4 border-b">客户信息</th>
            <th className="p-4 border-b">总金额</th>
            <th className="p-4 border-b">状态</th>
            <th className="p-4 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o: any) => (
            <tr key={o.id} className="hover:bg-gray-50 border-b">
              <td className="p-4 text-sm">{o.orderNumber}</td>
              <td className="p-4 text-sm">{o.customerName}</td>
              <td className="p-4 text-sm font-bold">${o.totalAmount.toFixed(2)}</td>
              <td className="p-4 text-sm">{o.status}</td>
              <td className="p-4 text-sm">
                {o.status === 'PENDING_REVIEW' && (
                  <>
                    <button onClick={() => action(o.id, 'approve')} className="text-green-600 mr-2">通过</button>
                    <button onClick={() => action(o.id, 'reject')} className="text-red-600">驳回</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-gray-500">暂无订单</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

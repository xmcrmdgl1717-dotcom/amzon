import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('admin_token');

  const loadReviews = () => {
    setLoading(true);
    fetch(`${API}/reviews`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadReviews(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定删除这条评论吗？')) return;
    await fetch(`${API}/reviews/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadReviews();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">加载中...</div>;

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">评论管理</h2>
      <div className="bg-white rounded-lg shadow border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4">商品</th>
              <th className="p-4">评分</th>
              <th className="p-4">评论内容</th>
              <th className="p-4">买家</th>
              <th className="p-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r: any) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm font-medium max-w-[150px] truncate">{r.product?.translations[0]?.title}</td>
                <td className="p-4 text-yellow-500 font-bold">{r.rating} 星</td>
                <td className="p-4 text-sm text-gray-700">{r.content}</td>
                <td className="p-4 text-sm text-gray-500">{r.customer?.name}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">暂无评论</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

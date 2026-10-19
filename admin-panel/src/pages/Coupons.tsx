import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Coupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [form, setForm] = useState({ code: '', discount: 0.1, isPercentage: true, minPurchase: 0 });
  const token = localStorage.getItem('admin_token');

  const loadCoupons = () => {
    fetch(`${API}/coupons`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setCoupons);
  };

  useEffect(() => { loadCoupons(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ code: '', discount: 0.1, isPercentage: true, minPurchase: 0 });
    loadCoupons();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定删除该优惠券吗？')) return;
    await fetch(`${API}/coupons/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadCoupons();
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">优惠券管理</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 border flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm mb-1">优惠码 (如: SAVE10)</label>
          <input required type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full border p-2 rounded uppercase" />
        </div>
        <div>
          <label className="block text-sm mb-1">折扣类型</label>
          <select value={form.isPercentage ? 'true' : 'false'} onChange={e => setForm({...form, isPercentage: e.target.value === 'true'})} className="w-full border p-2 rounded">
            <option value="true">百分比 (%)</option>
            <option value="false">固定金额 ($)</option>
          </select>
        </div>
        <div className="w-24">
          <label className="block text-sm mb-1">折扣值</label>
          <input required type="number" step="0.01" value={form.discount} onChange={e => setForm({...form, discount: Number(e.target.value)})} className="w-full border p-2 rounded" />
          <span className="text-xs text-gray-500">{form.isPercentage ? '例: 0.1 代表 10%' : '例: 10 代表 $10'}</span>
        </div>
        <div className="w-32">
          <label className="block text-sm mb-1">最低消费 ($)</label>
          <input type="number" value={form.minPurchase} onChange={e => setForm({...form, minPurchase: Number(e.target.value)})} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded h-[42px]">创建</button>
      </form>

      <div className="bg-white rounded-lg shadow border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4">优惠码</th><th className="p-4">折扣</th><th className="p-4">最低消费</th><th className="p-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c: any) => (
              <tr key={c.id} className="border-b">
                <td className="p-4 font-bold text-blue-600">{c.code}</td>
                <td className="p-4">{c.isPercentage ? `${c.discount * 100}%` : `$${c.discount}`}</td>
                <td className="p-4">${c.minPurchase}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 text-sm">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

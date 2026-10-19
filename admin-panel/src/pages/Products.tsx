import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', price: 0, image: '' });
  const token = localStorage.getItem('admin_token');

  const loadProducts = () => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, slug: `prod-${Date.now()}` })
    });
    setShowForm(false);
    setForm({ title: '', price: 0, image: '' });
    loadProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">商品管理</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          {showForm ? '取消添加' : '+ 添加商品'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">商品名称</label>
              <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">价格 ($)</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full border p-2 rounded" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">图片 URL</label>
            <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border p-2 rounded" placeholder="https://..." />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">保存商品</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-4 border-b">商品图片</th>
              <th className="p-4 border-b">商品名称</th>
              <th className="p-4 border-b">价格</th>
              <th className="p-4 border-b">库存</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50 border-b">
                <td className="p-4"><img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded" /></td>
                <td className="p-4 text-sm font-medium">{p.title}</td>
                <td className="p-4 text-sm font-bold text-gray-900">${p.price.toFixed(2)}</td>
                <td className="p-4 text-sm">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

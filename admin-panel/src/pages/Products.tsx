import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', price: 0, description: '', image: '', stock: 100, categoryId: '' });
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem('admin_token');

  const loadData = async () => {
    const [prodRes, catRes] = await Promise.all([
      fetch(`${API}/products`),
      fetch(`${API}/categories`)
    ]);
    setProducts(await prodRes.json());
    setCategories(await catRes.json());
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', price: 0, description: '', image: '', stock: 100, categoryId: '' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("图片太大");
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result as string }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return alert('请上传一张商品图片');
    const url = editingId ? `${API}/products/${editingId}` : `${API}/products`;
    const method = editingId ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, slug: `prod-${Date.now()}` })
    });
    resetForm();
    loadData();
  };

  const handleEditClick = (p: any) => {
    setForm({
      title: p.title, price: p.price, description: p.description,
      image: p.image, stock: p.stock, categoryId: p.categoryId || ''
    });
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个商品吗？')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">商品管理</h2>
        <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {showForm ? '取消' : '+ 添加商品'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4 border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm mb-1">商品名称</label>
              <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm mb-1">价格 ($)</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full border p-2 rounded" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">商品描述</label>
              <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm mb-1">所属分类</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full border p-2 rounded">
                <option value="">-- 未分类 --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">库存数量</label>
              <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="border-2 border-dashed p-4 text-center rounded-lg hover:bg-gray-50">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer" />
            {form.image && <img src={form.image} alt="Preview" className="h-24 mx-auto mt-4 rounded border" />}
          </div>
          <button type="submit" disabled={isUploading} className="bg-green-600 text-white px-6 py-2 rounded">保存商品</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4">商品</th><th className="p-4">分类</th><th className="p-4">价格</th><th className="p-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image} className="w-10 h-10 object-cover rounded border" />
                  <span className="font-medium text-sm">{p.title}</span>
                </td>
                <td className="p-4 text-sm text-gray-500">{p.categoryName || '未分类'}</td>
                <td className="p-4 font-bold text-green-600">${p.price.toFixed(2)}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => handleEditClick(p)} className="text-blue-500 font-medium text-sm">编辑</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 font-medium text-sm">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // 记录当前正在编辑的商品 ID
  const [form, setForm] = useState({ title: '', price: 0, description: '', image: '', stock: 100 });
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem('admin_token');

  const loadProducts = () => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  };

  useEffect(() => { loadProducts(); }, []);

  // 点击“取消”或“添加新商品”时重置表单
  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', price: 0, description: '', image: '', stock: 100 });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("图片太大，请选择小于 2MB 的图片");

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result as string }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // 提交（新增或编辑）
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
    loadProducts();
  };

  // 点击“编辑”按钮
  const handleEditClick = (product: any) => {
    setForm({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock
    });
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 滚动到顶部表单区
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个商品吗？')) return;
    await fetch(`${API}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    loadProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">商品管理</h2>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? '取消' : '+ 添加商品'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
            {editingId ? '编辑商品' : '添加新商品'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">商品名称</label>
              <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">价格 ($)</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1">商品描述</label>
              <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">库存数量</label>
              <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
            <label className="block text-sm font-medium mb-2 text-gray-700">商品图片 (本地上传)</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            {isUploading && <p className="text-blue-500 text-sm mt-2">正在处理图片...</p>}
            
            {form.image && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-xs text-gray-500 mb-2">图片预览：</p>
                <img src={form.image} alt="Preview" className="h-32 object-contain rounded border" />
              </div>
            )}
          </div>

          <button type="submit" disabled={isUploading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors">
            {editingId ? '保存修改' : '保存商品'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-medium">商品图片</th>
              <th className="p-4 font-medium">商品名称</th>
              <th className="p-4 font-medium">价格</th>
              <th className="p-4 font-medium">库存</th>
              <th className="p-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
                <td className="p-4">
                  <img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded border" />
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">{p.title}</td>
                <td className="p-4 text-sm font-bold text-green-600">${p.price.toFixed(2)}</td>
                <td className="p-4 text-sm">{p.stock}</td>
                <td className="p-4 text-sm text-right space-x-3">
                  <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700 font-medium">编辑</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-medium">删除</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">暂无商品，请添加。</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

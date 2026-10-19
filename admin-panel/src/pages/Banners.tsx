import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Banners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ imageUrl: '', linkUrl: '' });
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem('admin_token');

  const loadBanners = () => {
    setLoading(true);
    setError('');
    fetch(`${API}/banners/admin`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) throw new Error('获取轮播图失败，请检查后端是否正常运行');
        return res.json();
      })
      .then(data => {
        // 👈 安全兜底，防止 data 不是数组导致白屏
        setBanners(Array.isArray(data) ? data : []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBanners(); }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("图片太大，请选择小于 2MB 的图片");
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) return alert('请上传轮播图');
    await fetch(`${API}/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ imageUrl: '', linkUrl: '' });
    setShowForm(false);
    loadBanners();
  };

  const toggleActive = async (id: string) => {
    await fetch(`${API}/banners/${id}/toggle`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    loadBanners();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定删除这张轮播图吗？')) return;
    await fetch(`${API}/banners/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadBanners();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">加载中...</div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded">报错：{error}</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">首页轮播图管理</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {showForm ? '取消' : '+ 添加轮播图'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4 border">
          <div className="border-2 border-dashed p-4 text-center rounded-lg hover:bg-gray-50">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-sm file:bg-blue-50 file:text-blue-700 cursor-pointer" />
            {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="h-32 mx-auto mt-4 rounded border object-cover" />}
          </div>
          <div>
            <label className="block text-sm mb-1">跳转链接 (可选)</label>
            <input type="text" value={form.linkUrl} onChange={e => setForm({...form, linkUrl: e.target.value})} className="w-full border p-2 rounded" />
          </div>
          <button type="submit" disabled={isUploading} className="bg-green-600 text-white px-6 py-2 rounded">保存</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4">预览图</th><th className="p-4">状态</th><th className="p-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b: any) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="p-4"><img src={b.imageUrl} className="h-16 object-cover rounded border" /></td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${b.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {b.isActive ? '展示中' : '已隐藏'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => toggleActive(b.id)} className="text-blue-500 text-sm">{b.isActive ? '隐藏' : '启用'}</button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-500 text-sm">删除</button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-gray-500">暂无轮播图，请添加</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

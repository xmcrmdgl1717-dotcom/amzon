import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const token = localStorage.getItem('admin_token');

  const loadCategories = () => {
    fetch(`${API}/categories`).then(res => res.json()).then(setCategories);
  };

  useEffect(() => { loadCategories(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch(`${API}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name })
    });
    setName('');
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定删除该分类？关联商品将变为未分类状态。')) return;
    await fetch(`${API}/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    loadCategories();
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">分类管理</h2>
      
      <form onSubmit={handleAdd} className="flex gap-4 mb-6">
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="输入新分类名称 (如: Clothing)" 
          className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
          添加分类
        </button>
      </form>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">分类名称</th>
              <th className="p-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-xs text-gray-400 font-mono">{c.id.split('-')[0]}...</td>
                <td className="p-4 font-medium text-gray-800">{c.name}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

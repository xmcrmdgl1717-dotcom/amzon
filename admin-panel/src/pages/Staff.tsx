import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Staff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'OPERATOR' });
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('admin_token');

  const loadStaff = () => {
    fetch(`${API}/staff`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setStaff);
  };

  useEffect(() => { loadStaff(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ name: '', email: '', password: '', role: 'OPERATOR' });
    setShowForm(false);
    loadStaff();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">员工与权限管理</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {showForm ? '取消' : '+ 添加员工'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4 border">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm mb-1">姓名</label><input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm mb-1">邮箱</label><input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm mb-1">登录密码</label><input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border p-2 rounded" /></div>
            <div>
              <label className="block text-sm mb-1">角色</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border p-2 rounded">
                <option value="SUPER_ADMIN">超级管理员 (全权限)</option>
                <option value="OPERATOR">运营 (管理商品/订单)</option>
                <option value="SUPPORT">客服 (查看订单)</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">保存员工</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4">姓名</th><th className="p-4">邮箱</th><th className="p-4">角色</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s: any) => (
              <tr key={s.id} className="border-b">
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4 text-gray-600">{s.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    s.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                    s.role === 'OPERATOR' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {s.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

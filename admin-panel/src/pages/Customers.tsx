import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    fetch(`${API}/customers`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">注册客户列表</h2>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-sm">
            <th className="p-4 border-b">客户姓名</th>
            <th className="p-4 border-b">邮箱</th>
            <th className="p-4 border-b">注册时间</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c: any) => (
            <tr key={c.id} className="hover:bg-gray-50 border-b">
              <td className="p-4 text-sm font-medium">{c.name}</td>
              <td className="p-4 text-sm text-gray-600">{c.email}</td>
              <td className="p-4 text-sm text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan={3} className="p-8 text-center text-gray-500">暂无注册客户</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

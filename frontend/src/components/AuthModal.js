import React, { useState } from 'react';
import { API } from '../api'; // 确保 api.js 里暴露了 API

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegister ? '/customers/register' : '/customers/login';
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '操作失败');
      
      // 登录成功，保存 token，通知父组件
      localStorage.setItem('customer_token', data.accessToken);
      localStorage.setItem('customer_info', JSON.stringify(data.user));
      onLogin(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isRegister ? '注册新账号' : '登录'}</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <input required placeholder="姓名" className="w-full border p-2 rounded" 
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          )}
          <input required type="email" placeholder="邮箱" className="w-full border p-2 rounded" 
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input required type="password" placeholder="密码" className="w-full border p-2 rounded" 
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {isRegister ? '注册并登录' : '登录'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-blue-600 cursor-pointer" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
        </div>
        <button onClick={onClose} className="mt-4 w-full text-gray-500 text-sm hover:underline">取消</button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { API } from '../App';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API}/audit-logs`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) throw new Error('获取日志失败');
        return res.json();
      })
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">加载中...</div>;
  if (error) return <div className="p-8 text-center text-red-500">报错：{error}</div>;

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold mb-6">系统操作日志</h2>
      <div className="bg-white rounded-lg shadow border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4">时间</th><th className="p-4">操作人</th><th className="p-4">动作</th><th className="p-4">详情</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-4 text-sm">{log.user?.name || '系统'}</td>
                <td className="p-4 text-sm"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{log.action}</span></td>
                <td className="p-4 text-sm">{log.details}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">暂无日志</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

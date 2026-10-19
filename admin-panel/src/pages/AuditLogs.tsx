import { useState, useEffect } from 'react';
import { API } from '../App';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    fetch(`${API}/audit-logs`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setLogs);
  }, []);

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">系统操作日志</h2>
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4">时间</th>
              <th className="p-4">操作人</th>
              <th className="p-4">动作</th>
              <th className="p-4">详情</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-4 text-sm font-medium">{log.user?.name} <br/><span className="text-xs text-gray-400">{log.user?.email}</span></td>
                <td className="p-4 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{log.action}</span>
                </td>
                <td className="p-4 text-sm text-gray-700">{log.details}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">暂无日志</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

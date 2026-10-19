import { useState, useEffect } from 'react';

// 读取 Render 上的环境变量，如果没读到则默认连本地
const API = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
console.log('当前使用的后端 API 地址是:', API);

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [orders, setOrders] = useState<any[]>([]);
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const login = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API + '/auth/login', { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ email, password }) 
      });
      
      if (res.ok) {
        const data = await res.json();
        setToken(data.accessToken);
        localStorage.setItem('admin_token', data.accessToken);
      } else { 
        // 如果后端返回 500，或者账号密码错误
        const errData = await res.json().catch(() => ({}));
        alert(`登录失败，状态码: ${res.status}。\n后端返回信息: ${errData.message || '请检查数据库或后端日志'}`); 
      }
    } catch (error: any) {
      console.error('登录请求详细错误:', error);
      alert(`网络请求失败: ${error.message}\n\n可能原因：\n1. Render 免费后端正在冷启动，请先去新标签页访问 ${API}/products 唤醒它。\n2. CORS 跨域被拦截。请按 F12 查看 Console 面板。`);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = () => {
    if (!token) return;
    fetch(API + '/orders', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => {
        if(!r.ok) throw new Error('获取订单失败，可能 Token 过期');
        return r.json();
      })
      .then(setOrders)
      .catch(err => {
        console.error("获取订单错误:", err);
        alert("获取订单失败，请尝试重新登录");
        // 如果 token 失效，清理本地存储并退回登录页
        setToken('');
        localStorage.removeItem('admin_token');
      });
  };

  useEffect(() => { 
    loadOrders(); 
  }, [token]);

  const action = (id: string, type: string) => {
    fetch(`${API}/orders/${id}/${type}`, { 
      method: 'PATCH', 
      headers: { Authorization: 'Bearer ' + token } 
    }).then(() => loadOrders());
  };

  if (!token) {
    return (
      <div style={{ padding: 50, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Admin Login</h1>
        <form onSubmit={login}>
          <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Email" 
            style={{ padding: 8, marginBottom: 10, width: '250px' }} 
          /><br/>
          <input 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            type="password" 
            placeholder="Password" 
            style={{ padding: 8, marginBottom: 20, width: '250px' }} 
          /><br/>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '正在连接后端...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Order Management</h1>
        <button 
          onClick={() => { setToken(''); localStorage.removeItem('admin_token'); }} 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      <table border={1} cellPadding={10} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f0f0f0' }}>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>暂无订单</td></tr>
          ) : (
            orders.map((o: any) => (
              <tr key={o.id}>
                <td>{o.orderNumber}</td>
                <td>{o.customerName} <br/><small style={{color: '#666'}}>{o.customerEmail}</small></td>
                <td>{o.shippingAddr}</td>
                <td>${o.totalAmount.toFixed(2)}</td>
                <td><b>{o.status}</b></td>
                <td>
                  {o.status === 'PENDING_REVIEW' && (
                    <>
                      <button 
                        onClick={() => action(o.id, 'approve')} 
                        style={{ background: 'green', color: 'white', padding: '5px 10px', marginRight: 5, border: 'none', borderRadius: 3, cursor: 'pointer' }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => action(o.id, 'reject')} 
                        style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: 3, cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

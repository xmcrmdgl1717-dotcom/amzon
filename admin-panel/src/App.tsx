import { useState, useEffect } from 'react';

const API = 'http://localhost:3000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [orders, setOrders] = useState<any[]>([]);
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('admin123');

  const login = async (e: any) => {
    e.preventDefault();
    const res = await fetch(API + '/auth/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email, password }) });
    if (res.ok) {
      const data = await res.json();
      setToken(data.accessToken);
      localStorage.setItem('admin_token', data.accessToken);
    } else { alert('Login failed'); }
  };

  const load = () => {
    if (!token) return;
    fetch(API + '/orders', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).then(setOrders);
  };

  useEffect(() => { load(); }, [token]);

  const action = (id: string, type: string) => {
    fetch(`${API}/orders/${id}/${type}`, { method: 'PATCH', headers: { Authorization: 'Bearer ' + token } }).then(load);
  };

  if (!token) return (
    <div style={{ padding: 50, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Admin Login</h1>
      <form onSubmit={login}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{padding: 8, marginBottom: 10}} /><br/>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" style={{padding: 8, marginBottom: 20}} /><br/>
        <button type="submit" style={{padding: '10px 20px', cursor: 'pointer'}}>Login</button>
      </form>
    </div>
  );

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Order Management</h1>
        <button onClick={() => { setToken(''); localStorage.removeItem('admin_token'); }} style={{padding: '8px 16px', cursor: 'pointer'}}>Logout</button>
      </div>
      <table border={1} cellPadding={10} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f0f0f0' }}><tr><th>Order #</th><th>Customer</th><th>Address</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {orders.map((o: any) => (
            <tr key={o.id}>
              <td>{o.orderNumber}</td>
              <td>{o.customerName} <br/><small>{o.customerEmail}</small></td>
              <td>{o.shippingAddr}</td>
              <td>${o.totalAmount.toFixed(2)}</td>
              <td><b>{o.status}</b></td>
              <td>
                {o.status === 'PENDING_REVIEW' && (
                  <>
                    <button onClick={() => action(o.id, 'approve')} style={{ background: 'green', color: 'white', padding: '5px 10px', marginRight: 5, border: 'none', cursor: 'pointer' }}>Approve</button>
                    <button onClick={() => action(o.id, 'reject')} style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Categories from './pages/Categories';
import Staff from './pages/Staff';         // 👈 引入
import AuditLogs from './pages/AuditLogs'; // 👈 引入

export const API = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/login" replace />;

  const logout = () => { localStorage.removeItem('admin_token'); navigate('/login'); };
  
  // 👈 新增菜单项
  const navItems = [
    { path: '/dashboard', name: '仪表盘' },
    { path: '/orders', name: '订单管理' },
    { path: '/products', name: '商品管理' },
    { path: '/categories', name: '分类管理' },
    { path: '/customers', name: '客户管理' },
    { path: '/staff', name: '员工管理' },     // 新增
    { path: '/audit-logs', name: '操作日志' }, // 新增
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-800">Seller Central</div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`block px-4 py-2 rounded-md transition-colors ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md">退出登录</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 justify-between">
          <h2 className="text-xl font-semibold text-gray-800">管理后台</h2>
        </header>
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/orders" element={<Layout><Orders /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/categories" element={<Layout><Categories /></Layout>} />
        <Route path="/customers" element={<Layout><Customers /></Layout>} />
        <Route path="/staff" element={<Layout><Staff /></Layout>} />             {/* 👈 新增路由 */}
        <Route path="/audit-logs" element={<Layout><AuditLogs /></Layout>} />     {/* 👈 新增路由 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/products`)
        ]);
        const orders = await ordersRes.json();
        const products = await productsRes.json();
        
        // 计算各项数据
        let revenue = 0;
        let pending = 0;
        orders.forEach((o: any) => {
          if (o.status === 'APPROVED' || o.status === 'SHIPPED') revenue += o.totalAmount; // 仅统计有效订单的销售额
          if (o.status === 'PENDING_REVIEW') pending++;
        });

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          pendingOrders: pending,
          totalProducts: products.length
        });

        // 取前 5 个最新订单展示
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('获取统计失败', err);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">数据看板</h1>
      
      {/* 数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">总销售额 (有效)</p>
          <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">待审核订单</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">总订单量</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">在售商品数</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
        </div>
      </div>

      {/* 最新订单简表 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mt-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">最新订单</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4">订单号</th>
              <th className="p-4">客户</th>
              <th className="p-4">金额</th>
              <th className="p-4">状态</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o.id} className="border-b">
                <td className="p-4 text-sm">{o.orderNumber}</td>
                <td className="p-4 text-sm">{o.customerName}</td>
                <td className="p-4 text-sm font-bold">${o.totalAmount.toFixed(2)}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    o.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                    o.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {o.status}
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

import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, totalProducts: 0 });
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    // 并发请求获取统计数据
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/products`)
        ]);
        const orders = await ordersRes.json();
        const products = await productsRes.json();
        
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === 'PENDING_REVIEW').length,
          totalProducts: products.length
        });
      } catch (err) {
        console.error('获取统计失败', err);
      }
    };
    fetchData();
  }, [token]);

  const cards = [
    { title: '总订单量', value: stats.totalOrders, color: 'bg-blue-500' },
    { title: '待审核订单', value: stats.pendingOrders, color: 'bg-yellow-500' },
    { title: '在售商品', value: stats.totalProducts, color: 'bg-green-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">数据概览</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className={`w-16 h-16 rounded-full ${card.color} text-white flex items-center justify-center text-2xl font-bold mr-4`}>
              {card.value}
            </div>
            <div className="text-gray-600 font-medium text-lg">{card.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

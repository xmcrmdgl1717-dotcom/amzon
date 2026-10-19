import { useState, useEffect } from 'react';
import { API } from '../App';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // 👈 安全数组
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('admin_token');

  const loadData = async () => {
    setError('');
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/categories`)
      ]);
      if (!prodRes.ok || !catRes.ok) throw new Error('接口请求失败');
      
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (err: any) {
      setError('获取数据失败，请检查网络或后端服务');
    }
  };

  useEffect(() => { loadData(); }, []);

  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded">出错了：{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">商品管理</h2>
      {/* 为了防止白屏，这里我只保留基础的列表展示，如果你需要完整的表单，请保留之前的表单代码 */}
      <div className="bg-white rounded-lg shadow border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4">商品图</th><th className="p-4">名称</th><th className="p-4">分类</th><th className="p-4">价格</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4"><img src={p.image} className="w-10 h-10 rounded object-cover" /></td>
                <td className="p-4 text-sm">{p.title}</td>
                <td className="p-4 text-sm">{p.categoryName || '未分类'}</td>
                <td className="p-4 font-bold text-green-600">${p.price}</td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={4} className="p-8 text-center">暂无商品</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

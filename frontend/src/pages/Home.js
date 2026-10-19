import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import HeroBanner from '../components/HeroBanner';
import { fetchProducts } from '../api';
import ProductCard from '../components/ProductCard';

const Home = ({ searchQuery, locale }) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 拉取所有商品，供移动端楼层展示
  useEffect(() => {
    fetchProducts(locale)
      .then(data => setAllProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [locale]);

  // ================= 移动端 UI (仿 FreshCo) =================
  const MobileHome = () => {
    // 模拟分类金刚区图标 (可以从后台拉取，这里先用静态占位保证UI完整)
    const categories = [
      { name: 'Electronics', icon: '📱' },
      { name: 'Fashion', icon: '👗' },
      { name: 'Home', icon: '🏠' },
      { name: 'Beauty', icon: '💄' },
      { name: 'Sports', icon: '⚽' }
    ];

    return (
      <div className="md:hidden pb-20 bg-gray-100 min-h-screen">
        {/* 顶部搜索框替代品 (适配移动端) */}
        <div className="bg-white px-4 py-3 sticky top-0 z-40 shadow-sm">
           <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
             <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             <input type="text" placeholder="Search for a brand/product/suppliers" className="bg-transparent outline-none w-full text-sm" />
           </div>
        </div>

        {/* 顶部 Banner 区 */}
        <div className="px-2 mt-2">
           <HeroBanner />
        </div>

        {/* 金刚区 (分类快捷入口) */}
        <div className="bg-white mt-3 p-4">
          <div className="grid grid-cols-5 gap-2 text-center">
            {categories.map((c, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl shadow-sm mb-1">{c.icon}</div>
                <span className="text-[10px] text-gray-700 truncate w-full">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 楼层 1：Daily Deals (取前4个商品横向展示) */}
        <div className="bg-white mt-3 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Daily Deals</h2>
            <span className="text-xs text-blue-600">View All</span>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-2 hide-scrollbar">
            {allProducts.slice(0, 4).map(product => (
              <div key={product.id} className="w-28 flex-shrink-0">
                 <img src={product.image} className="w-full h-28 object-cover rounded-lg border" />
                 <p className="text-red-500 font-bold mt-1">${product.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 楼层 2：Popular Items (双列瀑布流) */}
        <div className="bg-white mt-3 p-3">
          <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">Popular Items</h2>
          <div className="grid grid-cols-2 gap-2">
            {allProducts.map(product => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </div>

        {/* 底部订阅区 (仿图) */}
        <div className="bg-gray-900 text-white p-6 mt-4">
          <h3 className="text-xl font-bold text-yellow-400 mb-1">FreshCo</h3>
          <p className="text-sm mb-4">Get More Coupons</p>
          <input type="email" placeholder="Your email address" className="w-full p-3 rounded text-black outline-none mb-3" />
          <button className="w-full border border-yellow-500 text-yellow-500 py-2 rounded font-bold">Subscribe</button>
          
          <div className="grid grid-cols-2 gap-4 mt-8 text-sm">
            <div>
              <h4 className="text-yellow-500 font-bold mb-2">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Online Customer Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="text-yellow-500 font-bold mb-2">Returns Exchange</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Return Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================= 大屏幕 (PC端) 保持原样 =================
  return (
    <>
      <MobileHome />
      
      <div className="hidden md:flex min-h-screen bg-gray-50">
        <div className="w-full flex flex-col">
          <HeroBanner />
          <div className="flex flex-1">
            <Sidebar onCategoryFilter={setActiveCategory} activeCategory={activeCategory} locale={locale} />
            <div className="flex-1">
              <ProductGrid categoryId={activeCategory} searchQuery={searchQuery} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

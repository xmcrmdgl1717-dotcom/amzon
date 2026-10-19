import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import HeroBanner from '../components/HeroBanner';
import { fetchProducts } from '../api';
import ProductCard from '../components/ProductCard';

const Home = ({ searchQuery, locale }) => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts(locale)
      .then(data => setAllProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [locale]);

  // ================= 移动端专属 UI (1:1 仿照截图) =================
  const MobileHome = () => {
    // 金刚区分类配置 (图标用 Emoji 代替，因为无法直接获取原图)
    const kingKongIcons = [
      { name: 'Women\'s\nClothing', icon: '👗' },
      { name: 'Snack Dessert', icon: '🍰' },
      { name: 'Fishing Gear', icon: '🎣' },
      { name: 'Phone Access', icon: '📱' },
      { name: 'Electronics', icon: '💻' },
    ];

    // 模拟店铺数据 (为了 UI 1:1)
    const mockStores = [
      { name: 'Rainbow Shop', followers: '46,574', products: 74, rating: '88%', sales: '302,123' },
      { name: 'Butik Sarang', followers: '52,827', products: 259, rating: '96%', sales: '31,863' },
      { name: 'FreshStore', followers: '49,479', products: 29, rating: '99%', sales: '174,796' },
    ];

    return (
      <div className="md:hidden bg-white min-h-screen pb-16">
        
        {/* 顶部搜索框 (下移，替换原本的 Header 搜索) */}
        <div className="px-4 py-3 sticky top-0 bg-white z-40 border-b border-gray-100">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search for a brand/product/suppliers" className="bg-transparent outline-none w-full text-xs text-gray-600" />
          </div>
        </div>

        {/* 顶部 Banner */}
        <div className="px-3 mt-2">
           <HeroBanner />
        </div>

        {/* 金刚区 */}
        <div className="px-2 mt-4 flex justify-between text-center">
          {kingKongIcons.map((c, i) => (
            <div key={i} className="flex flex-col items-center w-1/5">
              <div className="w-12 h-12 flex items-center justify-center text-3xl mb-1">{c.icon}</div>
              <span className="text-[10px] text-gray-700 whitespace-pre-line leading-tight">{c.name}</span>
            </div>
          ))}
        </div>

        {/* 楼层 1：Daily Deals */}
        <div className="mt-6 px-3">
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-base font-bold text-gray-900">Daily Deals</h2>
          </div>
          <div className="flex overflow-x-auto space-x-3 pb-2 hide-scrollbar">
            {allProducts.slice(0, 3).map(product => (
              <div key={product.id} className="w-[120px] flex-shrink-0">
                 <div className="w-full h-[120px] bg-gray-50 rounded-lg overflow-hidden">
                    <img src={product.image} className="w-full h-full object-cover" />
                 </div>
                 <p className="text-orange-500 font-bold mt-1 text-sm">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 楼层 2：Popular Items */}
        <div className="mt-6 px-3">
          <h2 className="text-base font-bold text-gray-900 mb-3">Popular Items</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {allProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </div>

        {/* 楼层 3：Popular Stores (纯静态 UI 还原) */}
        <div className="mt-8 px-3">
          <h2 className="text-base font-bold text-gray-900 mb-3">Popular Stores</h2>
          <div className="space-y-3">
            {mockStores.map((store, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold">R</div>
                    <div>
                      <h3 className="font-semibold text-sm">{store.name}</h3>
                      <p className="text-[10px] text-gray-400">Follow: {store.followers} · Product: {store.products}</p>
                    </div>
                  </div>
                  <button className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-medium">Visit the store &gt;</button>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 mt-3 pt-3 border-t border-gray-50">
                  <span>Rate of good reviews: {store.rating}</span>
                  <span>Total Sales: {store.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 楼层 4：Hot Deals */}
        <div className="mt-8 px-3">
          <h2 className="text-base font-bold text-gray-900 mb-3">Hot Deals</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {allProducts.slice(4, 10).map(product => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </div>

        {/* 黑色订阅区 (完全复刻) */}
        <div className="bg-gray-900 text-white p-6 mt-8">
          <h3 className="text-2xl font-black text-yellow-400 italic mb-1">FRESHCO</h3>
          <p className="text-sm text-yellow-500 mb-4">Get More Coupons</p>
          <input type="email" placeholder="Your email address" className="w-full p-3 rounded bg-white text-black outline-none mb-3 text-sm" />
          <button className="w-1/2 border border-yellow-500 text-yellow-500 py-2 rounded font-bold text-sm">Subscribe</button>
          
          <div className="grid grid-cols-2 gap-4 mt-8 text-xs">
            <div>
              <h4 className="text-yellow-500 font-bold mb-3 text-sm">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Online Customer Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="text-yellow-500 font-bold mb-3 text-sm">Returns Exchange</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Return Policy</li>
                <li>Delivery & collection</li>
                <li>Seller Policy</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    );
  };

  // ================= PC端保持原样 =================
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

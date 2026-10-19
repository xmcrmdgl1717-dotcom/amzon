import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import { en } from '../locales/en';
import { zh } from '../locales/zh';
import { id } from '../locales/id';

const Navbar = ({ onSearch, locale, setLocale }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('customer_info')));

  // 👈 获取当前语言字典
  const t = locale === 'zh' ? zh : locale === 'id' ? id : en;

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_info');
    setUser(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery, searchCategory);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-gray-900 text-white relative z-40">
        <div className="bg-gray-900 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <div className="flex items-center justify-between h-14">
              <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
                <div className="text-lg sm:text-2xl font-bold"><span className="text-orange-400">amazon</span></div>
              </Link>

              <div className="hidden lg:flex items-center text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-300 text-xs">{t.deliverTo}</span>
                  <div className="flex items-center font-bold">United States</div>
                </div>
              </div>

              <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
                <form onSubmit={handleSearch} className="flex">
                  <select className="hidden sm:block bg-gray-200 text-gray-900 px-2 sm:px-3 py-2 rounded-l-md text-sm" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
                    <option>{t.all}</option><option>Electronics</option><option>Books</option>
                  </select>
                  <input type="text" placeholder={t.searchPlaceholder} className="flex-1 px-4 py-2 text-gray-900 focus:outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button type="submit" className="bg-orange-400 px-4 py-2 rounded-r-md">🔍</button>
                </form>
              </div>

              <div className="flex items-center space-x-4">
                
                {/* 👈 真正的语言切换下拉框 */}
                <div className="hidden lg:flex items-center text-sm">
                  <select 
                    value={locale} 
                    onChange={(e) => setLocale(e.target.value)}
                    className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 outline-none cursor-pointer"
                  >
                    <option value="en">🇺🇸 EN</option>
                    <option value="zh">🇨🇳 中文</option>
                    <option value="id">🇮🇩 ID</option>
                  </select>
                </div>

                {user ? (
                  <div className="hidden md:flex flex-col text-sm cursor-pointer group relative p-1 hover:border hover:border-white">
                    <span className="text-xs">Hello, {user.name}</span>
                    <span className="font-bold">{t.account}</span>
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white text-black shadow-lg rounded hidden group-hover:block border z-50">
                      <Link to="/my-account" className="block p-3 text-sm hover:bg-gray-100">Your Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left p-3 text-sm text-red-600 hover:bg-gray-100">Sign Out</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => setShowAuth(true)} className="hidden md:flex flex-col text-sm cursor-pointer p-1 hover:border hover:border-white">
                    <span className="text-xs">{t.helloSignIn}</span>
                    <span className="font-bold">{t.account}</span>
                  </div>
                )}

                <div className="hidden lg:flex flex-col text-sm cursor-pointer p-1 hover:border hover:border-white">
                  <span className="text-xs">{t.returns}</span>
                  <span className="font-bold">{t.orders}</span>
                </div>

                <Link to="/cart" className="flex items-center relative p-1 hover:border hover:border-white">
                  <span className="text-2xl">🛒</span>
                  <span className="absolute -top-2 left-4 bg-orange-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{getCartItemsCount()}</span>
                  <span className="hidden sm:inline ml-1 text-sm font-bold">{t.cart}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 flex items-center h-10 space-x-6 text-sm">
            <span className="cursor-pointer font-bold">☰ {t.all}</span>
            <Link to="/deals" className="hover:border border-white px-1">{t.todaysDeals}</Link>
            <Link to="/customer-service" className="hover:border border-white px-1">{t.customerService}</Link>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLogin={(userData) => setUser(userData)} />
    </>
  );
};

export default Navbar;

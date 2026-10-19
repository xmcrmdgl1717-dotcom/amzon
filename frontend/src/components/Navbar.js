import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';

const Navbar = ({ onSearch, locale, setLocale }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('customer_info')));

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_info');
    setUser(null);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    navigate('/');
  };

  return (
    <>
      {/* ================= 移动端极简 Header ================= */}
      <nav className="md:hidden bg-white sticky top-0 z-50 px-4 py-2 flex items-center justify-between border-b border-gray-100">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="bg-[#b2d235] text-black font-black italic px-1.5 py-0.5 rounded-sm text-sm">
            FRESHCO
          </div>
        </Link>
        
        {/* 右侧图标 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 border border-gray-200 rounded px-1.5 py-0.5">
            <span className="text-sm">🇺🇸</span>
            <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>
      </nav>

      {/* ================= PC 端保留原黑色导航 ================= */}
      <nav className="hidden md:block bg-gray-900 text-white relative z-40">
        <div className="bg-gray-900 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-2xl font-bold"><span className="text-orange-400">amazon</span></Link>
              
              <div className="flex-1 max-w-2xl mx-8">
                <form onSubmit={handleSearchSubmit} className="flex">
                  <input
                    type="text"
                    placeholder="Search Amazon"
                    className="flex-1 px-4 py-2 text-gray-900 focus:outline-none rounded-l-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="bg-orange-400 px-4 py-2 rounded-r-md hover:bg-orange-500">🔍</button>
                </form>
              </div>

              <div className="flex items-center space-x-6">
                <select 
                  value={locale} 
                  onChange={(e) => setLocale(e.target.value)}
                  className="bg-transparent border border-gray-600 rounded px-2 py-1 outline-none cursor-pointer text-sm"
                >
                  <option value="en" className="text-black">🇺🇸 EN</option>
                  <option value="zh" className="text-black">🇨🇳 中文</option>
                  <option value="id" className="text-black">🇮🇩 ID</option>
                </select>

                {user ? (
                  <div className="relative group">
                    <div className="cursor-pointer text-sm hover:border hover:border-white p-1">
                      <span className="text-xs block">Hello, {user.name}</span>
                      <span className="font-bold">Account & Lists</span>
                    </div>
                    <div className="absolute top-full right-0 w-48 bg-white text-black shadow-lg rounded hidden group-hover:block border z-50">
                      <Link to="/my-account" className="block p-3 text-sm hover:bg-gray-100">Your Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left p-3 text-sm text-red-600 hover:bg-gray-100">Sign Out</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => setShowAuth(true)} className="cursor-pointer text-sm hover:border hover:border-white p-1">
                    <span className="text-xs block">Hello, sign in</span>
                    <span className="font-bold">Account & Lists</span>
                  </div>
                )}

                <Link to="/cart" className="flex items-center font-bold p-1 hover:border hover:border-white relative">
                  🛒 Cart
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 right-0 bg-orange-400 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">{getCartItemsCount()}</span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLogin={(userData) => setUser(userData)} />
    </>
  );
};

export default Navbar;

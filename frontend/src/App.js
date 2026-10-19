import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 引入全局状态
import { CartProvider } from './context/CartContext';

// 引入公共组件
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 引入所有页面
import Home from './pages/Home';
import Cart from './pages/Cart';
import MyAccount from './pages/MyAccount';
import TodaysDeals from './pages/TodaysDeals';
import CustomerService from './pages/CustomerService';
import Registry from './pages/Registry';
import GiftCards from './pages/GiftCards';
import Sell from './pages/Sell';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 👈 从 localStorage 初始化语言，默认 en
  const [locale, setLocale] = useState(localStorage.getItem('app_locale') || 'en');

  // 👈 当语言变化时，存入 localStorage，防止刷新重置
  useEffect(() => {
    localStorage.setItem('app_locale', locale);
  }, [locale]);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Navbar 接收搜索回调、当前语言和修改语言的函数 */}
          <Navbar 
            onSearch={(query) => setSearchQuery(query)} 
            locale={locale} 
            setLocale={setLocale} 
          />
          
          <main className="flex-1">
            <Routes>
              {/* 首页需要接收搜索词和语言，以便去后端拉取对应语言的数据 */}
              <Route path="/" element={<Home searchQuery={searchQuery} locale={locale} />} />
              
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/deals" element={<TodaysDeals />} />
              <Route path="/customer-service" element={<CustomerService />} />
              <Route path="/registry" element={<Registry />} />
              <Route path="/gift-cards" element={<GiftCards />} />
              <Route path="/sell" element={<Sell />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

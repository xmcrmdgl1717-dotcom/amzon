import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav'; // 👈 引入底部导航

// 引入页面组件
import Home from './pages/Home';
import Cart from './pages/Cart';
import MyAccount from './pages/MyAccount';
import TodaysDeals from './pages/TodaysDeals';
import CustomerService from './pages/CustomerService';
import Registry from './pages/Registry';
import GiftCards from './pages/GiftCards';
import Sell from './pages/Sell';
import ProductDetail from './pages/ProductDetail';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locale, setLocale] = useState(localStorage.getItem('app_locale') || 'en');

  useEffect(() => {
    localStorage.setItem('app_locale', locale);
  }, [locale]);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar onSearch={(q) => setSearchQuery(q)} locale={locale} setLocale={setLocale} />
          
          {/* 主内容区：移动端底部留出导航空间 (pb-16) */}
          <main className="flex-1 pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} locale={locale} />} />
              <Route path="/product/:id" element={<ProductDetail locale={locale} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/deals" element={<TodaysDeals />} />
              <Route path="/customer-service" element={<CustomerService />} />
              <Route path="/registry" element={<Registry />} />
              <Route path="/gift-cards" element={<GiftCards />} />
              <Route path="/sell" element={<Sell />} />
            </Routes>
          </main>
          
          {/* 移动端隐藏 Footer，显示 BottomNav；PC端相反 */}
          <div className="hidden md:block">
            <Footer />
          </div>
          <BottomNav />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

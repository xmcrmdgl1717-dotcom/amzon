import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import MyAccount from './pages/MyAccount';
import TodaysDeals from './pages/TodaysDeals';
import CustomerService from './pages/CustomerService';
import Registry from './pages/Registry';
import GiftCards from './pages/GiftCards';
import Sell from './pages/Sell';
import ProductDetail from './pages/ProductDetail'; // 👈 引入
import BottomNav from './components/BottomNav';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locale, setLocale] = useState(localStorage.getItem('app_locale') || 'en');

  useEffect(() => {
    localStorage.setItem('app_locale', locale);
  }, [locale]);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar onSearch={(q) => setSearchQuery(q)} locale={locale} setLocale={setLocale} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} locale={locale} />} />
              <Route path="/product/:id" element={<ProductDetail locale={locale} />} /> {/* 👈 新增路由 */}
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
          <BottomNav /> {/* 👈 新增 */}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

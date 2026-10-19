// 👈 所有的 import 都必须放在最顶部
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import TodaysDeals from './pages/TodaysDeals';
import CustomerService from './pages/CustomerService';
import Registry from './pages/Registry';
import GiftCards from './pages/GiftCards';
import Sell from './pages/Sell';
import MyAccount from './pages/MyAccount'; // 确保引入了 MyAccount

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [locale, setLocale] = useState('en');

  const handleSearch = (query, category) => {
    setSearchQuery(query);
    setSearchCategory(category);
  };

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar 
            onSearch={handleSearch} 
            locale={locale} 
            setLocale={setLocale} 
          />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={
                <Home 
                  searchQuery={searchQuery} 
                  searchCategory={searchCategory} 
                  locale={locale}
                />
              } />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-account" element={<MyAccount />} /> {/* 确保加了路由 */}
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

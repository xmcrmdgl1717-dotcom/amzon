import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import HeroBanner from '../components/HeroBanner'; // 👈 引入

const Home = ({ searchQuery, locale }) => {
  const [activeCategory, setActiveCategory] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 👈 顶部通栏 Banner */}
      <HeroBanner />

      <div className="flex flex-1">
        <Sidebar onCategoryFilter={setActiveCategory} activeCategory={activeCategory} locale={locale} />
        <div className="flex-1 lg:ml-0">
          <ProductGrid categoryId={activeCategory} searchQuery={searchQuery} locale={locale} />
        </div>
      </div>
    </div>
  );
};

export default Home;

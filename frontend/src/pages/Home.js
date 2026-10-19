import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import HeroBanner from '../components/HeroBanner';

const Home = ({ searchQuery, locale }) => {
  const [activeCategory, setActiveCategory] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">
      <div className="hidden md:block"><HeroBanner /></div>
      
      <div className="flex flex-1">
        {/* 移动端隐藏侧边栏 */}
        <div className="hidden md:block">
          <Sidebar onCategoryFilter={setActiveCategory} activeCategory={activeCategory} locale={locale} />
        </div>
        
        <div className="flex-1 lg:ml-0 p-2 md:p-4">
          <ProductGrid categoryId={activeCategory} searchQuery={searchQuery} locale={locale} />
        </div>
      </div>
    </div>
  );
};

export default Home;

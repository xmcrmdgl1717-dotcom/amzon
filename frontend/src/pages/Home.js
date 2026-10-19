import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';

// 接收来自 App.js 的 locale
const Home = ({ searchQuery, searchCategory, locale }) => {
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleCategoryFilter = (filter) => {
    setCategoryFilter(filter);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onCategoryFilter={handleCategoryFilter} />
      
      <div className="flex-1 lg:ml-0">
        <ProductGrid 
          categoryFilter={categoryFilter} 
          onClearFilter={handleCategoryFilter}
          searchQuery={searchQuery}
          searchCategory={searchCategory}
          locale={locale} // 传给 ProductGrid 以拉取对应语言的数据
        />
      </div>
    </div>
  );
};

export default Home;

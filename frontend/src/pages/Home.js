import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';

const Home = ({ searchQuery, locale }) => {
  const [activeCategory, setActiveCategory] = useState('');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 将 locale 传给侧边栏，支持分类名字的多语言（如果需要的话） */}
      <Sidebar 
        onCategoryFilter={setActiveCategory} 
        activeCategory={activeCategory} 
        locale={locale} 
      />
      <div className="flex-1 lg:ml-0">
        {/* 将 locale 传给商品列表，拉取对应语言的商品数据 */}
        <ProductGrid 
          categoryId={activeCategory} 
          searchQuery={searchQuery} 
          locale={locale} 
        />
      </div>
    </div>
  );
};

export default Home;

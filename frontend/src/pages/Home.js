import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';

const Home = ({ searchQuery, locale }) => {
  const [activeCategory, setActiveCategory] = useState('');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onCategoryFilter={setActiveCategory} activeCategory={activeCategory} />
      <div className="flex-1 lg:ml-0">
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

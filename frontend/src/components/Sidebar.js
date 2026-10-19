import React, { useState, useEffect } from 'react';

// 👈 修复：补上了漏掉的 => 符号
const Sidebar = ({ onCategoryFilter, activeCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // 从后端拉取真实分类
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  const handleCategoryClick = (id) => {
    if (onCategoryFilter) onCategoryFilter(id);
    setIsOpen(false);
  };

  return (
    <>
      <button className="lg:hidden fixed top-20 left-2 z-50 bg-gray-800 text-white p-2 rounded shadow-lg" onClick={() => setIsOpen(!isOpen)}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {isOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)} />}

      <div className={`fixed lg:static top-0 left-0 h-full w-72 lg:w-64 bg-white border-r transform transition-transform z-40 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Shop by Category</h2>
          
          <button onClick={() => handleCategoryClick('')} className={`w-full mb-4 font-medium py-2 px-4 rounded-md transition-colors ${!activeCategory ? 'bg-orange-400 text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Show All Products
          </button>
          
          <div className="space-y-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={`w-full text-left py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeCategory === c.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

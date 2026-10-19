import React, { useState, useEffect } from 'react';
import { en } from '../locales/en';
import { zh } from '../locales/zh';
import { id } from '../locales/id';

const Sidebar = ({ onCategoryFilter, activeCategory, locale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const t = locale === 'zh' ? zh : locale === 'id' ? id : en;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/categories`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <>
      <button className="lg:hidden fixed top-20 left-2 z-50 bg-gray-800 text-white p-2 rounded shadow-lg" onClick={() => setIsOpen(!isOpen)}>☰</button>
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)} />}

      <div className={`fixed lg:static top-0 left-0 h-full w-72 lg:w-64 bg-white border-r transform transition-transform z-40 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">{t.categories}</h2>
          <button onClick={() => { onCategoryFilter(''); setIsOpen(false); }} className={`w-full mb-4 font-medium py-2 px-4 rounded-md ${!activeCategory ? 'bg-orange-400' : 'bg-gray-100'}`}>
            {t.showAll}
          </button>
          <div className="space-y-1">
            {categories.map((c) => (
              <button key={c.id} onClick={() => { onCategoryFilter(c.id); setIsOpen(false); }} className={`w-full text-left py-2 px-3 rounded-md ${activeCategory === c.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
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

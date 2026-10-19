import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api';
import { en } from '../locales/en';
import { zh } from '../locales/zh';
import { id } from '../locales/id';

const ProductGrid = ({ categoryId, searchQuery, locale }) => {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const t = locale === 'zh' ? zh : locale === 'id' ? id : en;

  // 监听 locale 变化，重新拉取对应语言的商品
  useEffect(() => {
    setLoading(true);
    fetchProducts(locale || 'en')
      .then(data => setProductsData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [locale]);

  // 过滤逻辑：分类与搜索词
  const filteredProducts = useMemo(() => {
    let products = productsData;

    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      products = products.filter(product => 
        `${product.title} ${product.description}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return products;
  }, [productsData, categoryId, searchQuery]);

  // 排序逻辑
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (sortBy) {
      case 'price-low': return products.sort((a, b) => a.price - b.price);
      case 'price-high': return products.sort((a, b) => b.price - a.price);
      case 'rating': return products.sort((a, b) => b.rating - a.rating);
      default: return products;
    }
  }, [filteredProducts, sortBy]);

  // 分页逻辑
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="p-10 text-center text-lg text-gray-500">Loading products...</div>;

  return (
    // 外层容器：增加 pb-24 留出底部导航空间，md:pb-4 恢复PC端边距
    <div className="flex-1 p-2 sm:p-4 pb-24 md:pb-4">
      
      {/* 头部排序和统计 */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : t.allProducts}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {sortedProducts.length} {t.results}
          </p>
        </div>
        
        <div className="w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* 商品网格：移动端 2 列，平板 3 列，PC 4 列 */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter.</p>
        </div>
      )}

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-md text-sm ${
              currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            Prev
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-md text-sm ${
              currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* 底部统计 */}
      <div className="text-center text-xs sm:text-sm text-gray-500">
        Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} {t.results}
      </div>
    </div>
  );
};

export default ProductGrid;

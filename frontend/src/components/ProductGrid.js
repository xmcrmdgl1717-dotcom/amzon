import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api';

const ProductGrid = ({ categoryFilter, onClearFilter, searchQuery, searchCategory, locale }) => {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 拉取 API 数据
  useEffect(() => {
    setLoading(true);
    fetchProducts(locale || 'en')
      .then(data => setProductsData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [locale]);

  // 完美保留你的过滤逻辑
  const filteredProducts = useMemo(() => {
    let products = productsData;

    if (searchQuery && searchQuery.trim() !== '') {
      products = products.filter(product => {
        const searchText = `${product.title} ${product.description}`.toLowerCase();
        const query = searchQuery.toLowerCase();
        if (searchCategory && searchCategory !== 'All') {
          const categoryMatch = searchText.includes(searchCategory.toLowerCase());
          return searchText.includes(query) && categoryMatch;
        }
        return searchText.includes(query);
      });
    }

    if (!categoryFilter || categoryFilter === 'all') return products;
    
    // 因为我们在后端种子数据里使用了原生的 1-40 数字 ID，你的硬编码过滤逻辑依然完美生效！
    return products.filter(product => {
      const productId = parseInt(product.id, 10); // 转成数字比较
      switch (categoryFilter) {
        case 'electronics-computers': return [4, 15, 16].includes(productId);
        case 'electronics-phones': return [1, 13, 14].includes(productId);
        case 'electronics-audio': return [3, 9, 17, 18].includes(productId);
        case 'electronics-gaming': return [6, 19, 20].includes(productId);
        case 'electronics-smart': return [5, 2, 21, 22].includes(productId);
        case 'home-kitchen': return [7, 12, 31, 32].includes(productId);
        case 'bestsellers': return product.rating >= 4.7;
        case 'new-releases': return productId >= 35;
        case 'deals': return product.price <= 200;
        case 'reviews': return product.reviewCount >= 15000;
        default: return true;
      }
    });
  }, [productsData, categoryFilter, searchQuery, searchCategory]);

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (sortBy) {
      case 'price-low': return products.sort((a, b) => a.price - b.price);
      case 'price-high': return products.sort((a, b) => b.price - a.price);
      case 'rating': return products.sort((a, b) => b.rating - a.rating);
      case 'newest': return products.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      default: return products;
    }
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="p-10 text-center text-lg">Loading products...</div>;

  return (
    <div className="flex-1 p-2 sm:p-4">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {sortedProducts.length} results
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
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <button onClick={() => onClearFilter && onClearFilter('all')} className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-medium py-2 px-4 rounded-md">
            Show All Products
          </button>
        </div>
      )}

      {/* 分页逻辑完美保留 */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-2 sm:px-3 py-2 rounded-md text-sm ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white border text-gray-700'}`}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return <button key={page} onClick={() => handlePageChange(page)} className={`px-2 sm:px-3 py-2 rounded-md text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700'}`}>{page}</button>;
            }
            return null;
          })}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`px-2 sm:px-3 py-2 rounded-md text-sm ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-white border text-gray-700'}`}>Next</button>
        </div>
      )}

      <div className="mt-4 text-center text-xs sm:text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} results
      </div>
    </div>
  );
};

export default ProductGrid;

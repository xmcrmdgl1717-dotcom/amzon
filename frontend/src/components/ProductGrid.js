import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api';

const ProductGrid = ({ categoryId, searchQuery, locale }) => {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setLoading(true);
    fetchProducts(locale || 'en')
      .then(data => setProductsData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [locale]);

  const filteredProducts = useMemo(() => {
    let products = productsData;

    // 1. 过滤分类
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }

    // 2. 过滤搜索
    if (searchQuery && searchQuery.trim() !== '') {
      products = products.filter(product => 
        `${product.title} ${product.description}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return products;
  }, [productsData, categoryId, searchQuery]);

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (sortBy) {
      case 'price-low': return products.sort((a, b) => a.price - b.price);
      case 'price-high': return products.sort((a, b) => b.price - a.price);
      case 'rating': return products.sort((a, b) => b.rating - a.rating);
      default: return products;
    }
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="p-10 text-center text-lg">Loading products...</div>;

  return (
    <div className="flex-1 p-2 sm:p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-sm text-gray-600">{sortedProducts.length} results</p>
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
        </select>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No products found.</div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{page}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

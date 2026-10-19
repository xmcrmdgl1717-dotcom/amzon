// src/components/ProductGrid.js
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api'; // 引入 API

const ProductGrid = ({ categoryFilter, onClearFilter, searchQuery, searchCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchProducts('en')
      .then(data => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 注意：因为现在数据是动态的，原本写死的 ID 过滤（如 [4, 15, 16]）可能失效
  // 这里保留了你的过滤结构，但建议后续根据后端的 category 字段做真实过滤
  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery) {
      result = result.filter(p => `${p.title} ${p.description}`.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [products, searchQuery]);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    return result;
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="p-10 text-center">Loading products from API...</div>;

  return (
    <div className="flex-1 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Products</h1>
          <p className="text-sm text-gray-600">{sortedProducts.length} results</p>
        </div>
      </div>

      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">No products found.</div>
      )}
    </div>
  );
};

export default ProductGrid;
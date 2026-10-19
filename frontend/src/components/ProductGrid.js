import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api';

// 删除了未使用的 props，避免 ESLint 报错
const ProductGrid = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从后端 API 拉取真实数据
    fetchProducts('en')
      .then(data => setProducts(data))
      .catch(err => {
        console.error("获取商品失败:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 搜索过滤逻辑
  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery && searchQuery.trim() !== '') {
      result = result.filter(p => 
        `${p.title} ${p.description}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [products, searchQuery]);

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading products from API...</div>;
  }

  return (
    <div className="flex-1 p-2 sm:p-4">
      {/* 头部信息 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">All Products</h1>
          <p className="text-sm text-gray-600">{filteredProducts.length} results</p>
        </div>
      </div>

      {/* 商品网格 */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

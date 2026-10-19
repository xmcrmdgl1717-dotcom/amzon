import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api';

const ProductGrid = ({ searchQuery, locale }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 根据语言拉取商品
    fetchProducts(locale || 'en')
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [locale]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery && searchQuery.trim() !== '') {
      result = result.filter(p => 
        `${p.title} ${p.description}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [products, searchQuery]);

  if (loading) return <div className="p-10 text-center text-lg">Loading products...</div>;

  return (
    <div className="flex-1 p-2 sm:p-4">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">All Products</h1>
        <p className="text-sm text-gray-600">{filteredProducts.length} results</p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

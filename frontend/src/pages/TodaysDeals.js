import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';

const TodaysDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts('en')
      .then(data => {
        // 模拟打折：假设后端商品价格如果低于 500 就是特价商品
        const deals = data.filter(p => p.price <= 500);
        setProducts(deals);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dealCategories = [
    { id: 'all', label: 'All Deals' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'home', label: 'Home & Kitchen' },
    { id: 'books', label: 'Books' }
  ];

  if (loading) return <div className="p-10 text-center">Loading deals...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Today's Deals</h1>
          <p className="text-sm sm:text-base text-gray-600">Limited-time offers on top products</p>
        </div>

        {/* Deal Categories */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
            {dealCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Deal (拿第一个商品做头图) */}
        {products.length > 0 && (
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 sm:p-6 lg:p-8 text-white mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-4 sm:mb-6 md:mb-0 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Deal of the Day</h2>
                <p className="text-base sm:text-lg lg:text-xl mb-3 sm:mb-4">Save on {products[0].title}</p>
                <div className="text-xl sm:text-2xl font-bold">Starting at ${products[0].price}</div>
              </div>
              <div className="w-full md:w-1/2 text-center">
                <img 
                  src={products[0].image} 
                  alt={products[0].title}
                  className="mx-auto rounded-lg shadow-lg max-w-[200px] sm:max-w-[250px] md:max-w-[300px] w-full h-auto"
                />
              </div>
            </div>
          </div>
        )}

        {/* Deals Grid */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">All Deals</h2>
            <span className="text-sm sm:text-base text-gray-600">{products.length} deals found</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map(deal => (
              <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={deal.image} alt={deal.title} className="w-full h-40 sm:h-48 object-cover" />
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold">Deal</div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{deal.title}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg sm:text-2xl font-bold text-red-600">${deal.price}</span>
                  </div>
                  <Link to="/" className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded block text-center text-sm sm:text-base">
                    View Deal
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysDeals;

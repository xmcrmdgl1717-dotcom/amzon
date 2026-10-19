import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { en } from '../locales/en';
import { zh } from '../locales/zh';
import { id } from '../locales/id';

const ProductDetail = ({ locale }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 获取字典
  const t = locale === 'zh' ? zh : locale === 'id' ? id : en;

  useEffect(() => {
    setLoading(true);
    // 请求单个商品数据
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/products/${id}?locale=${locale}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setProduct(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, locale]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>);
    }
    if (hasHalfStar) {
      stars.push(<svg key="half" className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20"><defs><linearGradient id="halfStar"><stop offset="50%" stopColor="#F59E0B"/><stop offset="50%" stopColor="#E5E7EB"/></linearGradient></defs><path fill="url(#halfStar)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>);
    }
    return stars;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 面包屑 / 返回 */}
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-6 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {t.backToResults}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* 左侧：大图 */}
          <div className="md:col-span-5 flex justify-center items-start">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full max-w-md object-contain rounded-lg shadow-sm border p-4 sticky top-8" 
            />
          </div>

          {/* 中间：商品信息 */}
          <div className="md:col-span-4 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(product.rating || 4.5)}</div>
              <span className="text-blue-600 hover:underline cursor-pointer">{product.rating || 4.5}</span>
              <span className="text-gray-500">({product.reviewCount?.toLocaleString()} ratings)</span>
            </div>

            <hr />

            <div className="space-y-1">
              <div className="flex items-end space-x-1">
                <span className="text-sm mt-1">$</span>
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">{product.price.toFixed(2)}</span>
              </div>
              {product.isPrime && (
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Prime</span>
                  <span className="text-sm text-green-700 ml-2 font-medium">{t.freeDelivery}</span>
                </div>
              )}
            </div>

            <hr />

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.description}</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {product.description || 'No description available for this product.'}
              </p>
            </div>
          </div>

          {/* 右侧：购买框 */}
          <div className="md:col-span-3">
            <div className="border border-gray-300 rounded-lg p-4 sticky top-8 shadow-sm">
              <div className="text-xl font-bold text-gray-900 mb-2">${product.price.toFixed(2)}</div>
              <div className="text-green-700 font-medium mb-4">
                {product.stock > 0 ? t.inStock : <span className="text-red-600">{t.outOfStock}</span>}
              </div>
              
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`w-full py-2 rounded-md font-medium mb-2 transition-colors ${
                  product.stock <= 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                }`}
              >
                {isInCart(product.id) ? t.addedToCart : t.addToCart}
              </button>
              
              <button
                onClick={() => { addToCart(product); navigate('/cart'); }}
                disabled={product.stock <= 0}
                className={`w-full py-2 rounded-md font-medium transition-colors ${
                  product.stock <= 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {t.buyNow}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

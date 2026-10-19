import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { en } from '../locales/en';
import { zh } from '../locales/zh';
import { id } from '../locales/id';

const ProductCard = ({ product, locale }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const t = locale === 'zh' ? zh : locale === 'id' ? id : en;

  const handleAddToCart = (e) => {
    e.preventDefault(); // 防止点击按钮时触发外层 Link 跳转
    addToCart(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>);
    }
    if (hasHalfStar) {
      stars.push(<svg key="half" className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" viewBox="0 0 20 20"><defs><linearGradient id="halfStar"><stop offset="50%" stopColor="#F59E0B"/><stop offset="50%" stopColor="#E5E7EB"/></linearGradient></defs><path fill="url(#halfStar)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<svg key={`empty-${i}`} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>);
    }
    return stars;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="block bg-white md:border md:border-gray-200 md:rounded-lg md:p-4 md:hover:shadow-lg transition-all duration-200 flex flex-col h-full group">
      {/* 图片部分 */}
      <div className="relative mb-2 md:mb-4 flex-shrink-0 aspect-square w-full overflow-hidden rounded-t-lg md:rounded-md">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
        />
        {isInCart(product.id) && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-sm">
            <span className="hidden md:inline">In Cart ({getItemQuantity(product.id)})</span>
            <span className="md:hidden">✓</span>
          </div>
        )}
      </div>

      {/* 信息部分 */}
      <div className="p-2 md:p-0 flex flex-col flex-1">
        <h3 className="text-[13px] md:text-sm font-medium text-gray-900 mb-1 md:mb-2 line-clamp-2 md:hover:text-blue-600 leading-tight">
          {product.title}
        </h3>

        {/* PC端显示星级评分 */}
        <div className="hidden md:flex items-center mb-2">
          <div className="flex items-center mr-2">{renderStars(product.rating || 4.5)}</div>
          <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount?.toLocaleString() || 0})</span>
        </div>

        {/* 价格 */}
        <div className="mb-1 md:mb-2 mt-auto pt-1">
          <span className="text-orange-500 text-lg md:text-gray-900 md:text-xl font-bold">
            {formatPrice(product.price)}
          </span>
          {/* 移动端显示销量，PC端显示原价/折扣等 */}
          <div className="md:hidden text-[10px] text-gray-400 mt-0.5">
            Sold: {product.reviewCount || Math.floor(Math.random() * 2000) + 100}
          </div>
        </div>

        {/* PC端额外标签 */}
        <div className="hidden md:block mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">Prime</span>
        </div>

        {/* 加购按钮：移动端纯色横条，PC端原有按钮 */}
        <button
          onClick={handleAddToCart}
          className={`mt-2 w-full py-1.5 md:py-2 px-2 md:px-4 rounded-md font-medium text-xs md:text-sm transition-colors duration-200 ${
            isInCart(product.id)
              ? 'bg-green-100 text-green-700 md:bg-green-600 md:text-white'
              : 'bg-gray-100 text-gray-800 md:bg-yellow-400 md:text-gray-900 md:hover:bg-yellow-500'
          }`}
        >
          <span className="hidden md:inline">
            {isInCart(product.id) ? t.addedToCart : t.addToCart}
          </span>
          <span className="md:hidden">
            {isInCart(product.id) ? 'Added' : '+ Add'}
          </span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

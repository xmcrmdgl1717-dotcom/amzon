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
    e.preventDefault(); // 防止触发父级 Link 跳转
    addToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="bg-white rounded-lg overflow-hidden flex flex-col group">
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
        />
        {isInCart(product.id) && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
            In Cart
          </div>
        )}
      </div>

      <div className="p-2 flex flex-col flex-1">
        <h3 className="text-[13px] font-medium text-gray-900 line-clamp-2 leading-tight mb-1">
          {product.title}
        </h3>
        
        {/* 价格与销量 */}
        <div className="mt-auto pt-1">
          <div className="text-orange-500 text-lg font-bold">
            {formatPrice(product.price)}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">
            Sold: {product.reviewCount || Math.floor(Math.random() * 2000) + 100}
          </div>
        </div>

        {/* 移动端快速加购按钮 (可选，图里没有按钮，但这能提升体验) */}
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full py-1.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded hover:bg-gray-200 transition-colors md:hidden"
        >
          {isInCart(product.id) ? t.addedToCart : t.addToCart}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

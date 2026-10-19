import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, locale }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="block h-full flex flex-col group">
      {/* 图片区域：无边框，全宽，微圆角 */}
      <div className="relative aspect-square w-full mb-2 overflow-hidden rounded-md bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Image'; }}
        />
      </div>

      {/* 内容区域 */}
      <div className="flex flex-col flex-1 px-1">
        <h3 className="text-[13px] text-gray-800 line-clamp-2 leading-tight mb-1">
          {product.title}
        </h3>
        
        {/* 移动端：价格 + 销量 */}
        <div className="mt-auto md:hidden">
          <div className="text-orange-500 font-bold text-[15px]">
            ${product.price.toFixed(2)}
          </div>
          <div className="text-[10px] text-gray-400">
            Sold: {product.reviewCount || 1452}
          </div>
        </div>

        {/* PC 端保留原有的复杂样式 */}
        <div className="hidden md:block mt-auto">
          <div className="text-gray-900 font-bold text-lg mb-1">${product.price.toFixed(2)}</div>
          <button onClick={handleAddToCart} className="w-full bg-yellow-400 text-gray-900 py-1.5 rounded mt-2">
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

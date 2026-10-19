import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/banners`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setBanners(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // 自动轮播
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5秒切换一次
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    // 如果没有设置 Banner，给个默认占位（或者返回 null 隐藏）
    return null; 
  }

  return (
    <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-200">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {banner.linkUrl ? (
            <Link to={banner.linkUrl} className="block w-full h-full">
              <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
            </Link>
          ) : (
            <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
          )}
        </div>
      ))}

      {/* 底部的指示圆点 */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;

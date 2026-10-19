import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { en } from '../locales/en';
import { zh } from '../locales/zh';
import { id } from '../locales/id';

const ProductDetail = ({ locale }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 评论表单状态
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  
  const user = JSON.parse(localStorage.getItem('customer_info'));
  const t = locale === 'zh' ? zh : locale === 'id' ? id : en;

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, revRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/products/${id}?locale=${locale}`),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/reviews/product/${id}`)
      ]);
      if (prodRes.ok) setProduct(await prodRes.json());
      if (revRes.ok) setReviews(await revRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id, locale]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to review.');
    if (!newContent.trim()) return;
    
    setIsSubmitting(true);
    setSubmitMsg('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: newRating,
          content: newContent,
          productId: id,
          customerId: user.id
        })
      });
      if (res.ok) {
        setSubmitMsg('Review submitted successfully!');
        setNewContent('');
        setNewRating(5);
        loadData(); // 刷新页面数据，更新平均星级
      } else {
        setSubmitMsg('Failed to submit review.');
      }
    } catch (err) {
      setSubmitMsg('Error submitting review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating, size = "w-5 h-5") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg key={i} className={`${size} ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }
    return stars;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-6 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {t.backToResults}
        </button>

        {/* 商品信息区 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-5 flex justify-center items-start">
            <img src={product.image} alt={product.title} className="w-full max-w-md object-contain rounded-lg shadow-sm border p-4 sticky top-8" />
          </div>

          <div className="md:col-span-4 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(product.rating || 4.5)}</div>
              <span className="text-blue-600 hover:underline cursor-pointer">{product.rating?.toFixed(1) || '4.5'}</span>
              <span className="text-gray-500">({product.reviewCount} ratings)</span>
            </div>
            <hr />
            <div className="flex items-end space-x-1">
              <span className="text-sm mt-1">$</span>
              <span className="text-3xl font-bold">{product.price.toFixed(2)}</span>
            </div>
            <hr />
            <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
          </div>

          <div className="md:col-span-3">
            <div className="border rounded-lg p-4 sticky top-8 shadow-sm">
              <div className="text-xl font-bold mb-2">${product.price.toFixed(2)}</div>
              <div className="text-green-700 font-medium mb-4">{product.stock > 0 ? t.inStock : <span className="text-red-600">{t.outOfStock}</span>}</div>
              <button onClick={() => addToCart(product)} disabled={product.stock <= 0} className={`w-full py-2 rounded-md font-medium mb-2 ${product.stock <= 0 ? 'bg-gray-300' : 'bg-yellow-400 hover:bg-yellow-500'}`}>
                {isInCart(product.id) ? t.addedToCart : t.addToCart}
              </button>
              <button onClick={() => { addToCart(product); navigate('/cart'); }} disabled={product.stock <= 0} className={`w-full py-2 rounded-md font-medium ${product.stock <= 0 ? 'bg-gray-300' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                {t.buyNow}
              </button>
            </div>
          </div>
        </div>

        {/* 评论区 */}
        <div className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 左侧：写评论 */}
            <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-bold mb-4">Review this product</h3>
              <p className="text-sm text-gray-600 mb-4">Share your thoughts with other customers</p>
              
              {user ? (
                <form onSubmit={handleReviewSubmit}>
                  <div className="flex mb-4 cursor-pointer">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} onClick={() => setNewRating(star)}>
                        {renderStars(star, "w-6 h-6")[star-1]}
                      </span>
                    ))}
                  </div>
                  <textarea 
                    rows="3" 
                    placeholder="Write your review..." 
                    className="w-full border p-2 rounded mb-3 text-sm"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  {submitMsg && <p className="text-green-600 text-sm mt-2">{submitMsg}</p>}
                </form>
              ) : (
                <div className="text-sm text-gray-600">Please sign in to write a review.</div>
              )}
            </div>

            {/* 右侧：评论列表 */}
            <div className="md:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">{renderStars(review.rating, "w-4 h-4")}</div>
                      <span className="font-bold text-sm">{review.customer?.name || 'Anonymous'}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.content}</p>
                    <p className="text-xs text-gray-400 mt-2">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;

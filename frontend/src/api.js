// 基础 API 地址配置
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// 1. 获取商品列表 (带安全兜底)
export async function fetchProducts(locale = 'en') {
  try {
    const res = await fetch(`${API_BASE}/products?locale=${locale}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Fetch products failed:', err);
    return [];
  }
}

// 2. 提交订单 (接入多语言、优惠券等)
export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create order');
  }
  return res.json();
}

// 3. 校验优惠券
export async function validateCoupon(code, cartTotal) {
  const res = await fetch(`${API_BASE}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, cartTotal })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // 抛出后端返回的具体错误信息 (如: Minimum purchase required)
    throw new Error(errorData.message || 'Invalid coupon code');
  }
  return res.json();
}

// src/api.js
const API_BASE = 'http://localhost:3000';

// 获取多语言商品列表
export async function fetchProducts(locale = 'en') {
  const res = await fetch(`${API_BASE}/products?locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// 提交订单（状态直接进入 PENDING_REVIEW）
export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}
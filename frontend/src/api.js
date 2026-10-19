// CRA 项目必须以 REACT_APP_ 开头读取环境变量
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// 获取商品（支持多语言）
export async function fetchProducts(locale = 'en') {
  const res = await fetch(`${API_BASE}/products?locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// 提交订单
export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

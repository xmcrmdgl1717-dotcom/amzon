const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export async function fetchProducts(locale = 'en') {
  try {
    const res = await fetch(`${API_BASE}/products?locale=${locale}`);
    // 👈 如果后端崩了（500等），返回空数组，不要抛错导致白屏
    if (!res.ok) return []; 
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Fetch products failed:', err);
    return []; // 网络错误也返回空数组
  }
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

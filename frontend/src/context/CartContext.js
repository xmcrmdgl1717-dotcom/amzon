// src/context/CartContext.js
import React, { createContext, useContext, useReducer } from 'react';
import { createOrder } from '../api'; // 引入 API

const CART_ACTIONS = { ADD_TO_CART: 'ADD_TO_CART', REMOVE_FROM_CART: 'REMOVE_FROM_CART', UPDATE_QUANTITY: 'UPDATE_QUANTITY', CLEAR_CART: 'CLEAR_CART' };

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return { ...state, items: state.items.map(item => item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item) };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    case CART_ACTIONS.REMOVE_FROM_CART:
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case CART_ACTIONS.UPDATE_QUANTITY:
      if (action.payload.quantity <= 0) return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
      return { ...state, items: state.items.map(item => item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item) };
    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };
    default:
      return state;
  }
};

const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = (product) => dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product });
  const removeFromCart = (productId) => dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId });
  const updateQuantity = (productId, quantity) => dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  const clearCart = () => dispatch({ type: CART_ACTIONS.CLEAR_CART });
  
  const getCartItemsCount = () => state.items.reduce((total, item) => total + item.quantity, 0);
  const getCartTotal = () => state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const isInCart = (productId) => state.items.some(item => item.id === productId);
  const getItemQuantity = (productId) => state.items.find(item => item.id === productId)?.quantity || 0;

  // 【新增】下单逻辑
  const checkout = async (customerInfo) => {
    const payload = {
      ...customerInfo,
      locale: 'en', // 可扩展
      items: state.items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };
    const result = await createOrder(payload);
    clearCart();
    return result;
  };

  return (
    <CartContext.Provider value={{ cartItems: state.items, addToCart, removeFromCart, updateQuantity, clearCart, getCartItemsCount, getCartTotal, isInCart, getItemQuantity, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
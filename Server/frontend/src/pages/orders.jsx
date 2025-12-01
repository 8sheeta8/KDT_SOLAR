//orders.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../utils/api';
import '../styles/orders.css';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      if (error.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <div className="loading-text">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-content">
        <h1 className="orders-title">Order History</h1>
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h2 className="order-id">
                  Order #{order._id.slice(-6)}
                </h2>
                <span className={`order-status status-${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item._id} className="order-item">
                    <div className="item-details">
                      <h3 className="item-name">{item.product.name}</h3>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <span className="item-price">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div className="order-info">
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="order-address">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </p>
                </div>
                <div className="order-total">
                  ${order.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="empty-orders">
              <div className="empty-icon">📦</div>
              <p className="empty-text">No orders found</p>
              <button onClick={() => navigate('/')} className="start-shopping-btn">
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
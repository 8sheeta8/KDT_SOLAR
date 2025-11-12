//checkout.jsx

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../utils/api';
import '../styles/checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cart = state?.cart || [];

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: 1,
        })),
        shippingAddress,
      };

      await createOrder(orderData);
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating order');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="return-shop-btn">
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-grid">
          {/* Order Summary */}
          <div className="order-summary-card">
            <h2 className="card-title">Order Summary</h2>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">${item.price.toLocaleString()}</p>
                  </div>
                  <span className="item-qty">Qty: 1</span>
                </div>
              ))}
              <div className="total-section">
                <span className="total-label">Total:</span>
                <span className="total-amount">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="shipping-form-card">
            <h2 className="card-title">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="shipping-form">
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    street: e.target.value,
                  })
                }
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    state: e.target.value,
                  })
                }
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="form-input"
                required
              />
              <button type="submit" className="place-order-btn">
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
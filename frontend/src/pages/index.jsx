//index.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup, getProducts } from "../utils/api";
import ProductCard from "../components/ProductCard";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await (isLogin ? login(formData) : signup(formData));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first");
      return;
    }
    setCart([...cart, product]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/checkout", { state: { cart } });
  };

  return (
    <div className="home-container">
      <div className="container">
        {/* Auth Form */}
        {!localStorage.getItem("user") && (
          <div className="auth-card">
            <h2 className="auth-title">
              {isLogin ? 'Login' : 'Sign Up'}
            </h2>
            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="form-input"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="form-input"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="form-input"
                required
              />
              <button type="submit" className="form-button">
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="toggle-button"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        )}

        {/* Products Section */}
        <div className="products-section">
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-item">
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <div className="cart-content">
              <h3 className="cart-title">
                Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>
              <button onClick={handleCheckout} className="checkout-button">
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
//ProductCard.jsx

import "../styles/productcard.css";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />
        <div className="product-overlay">
          <span className="product-category">{product.category}</span>
        </div>
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-info">
          <span className="product-price">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className={`add-to-cart-button ${product.stock === 0 ? 'out-of-stock' : ''}`}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
        <div className="product-meta">
          <p className="stock-info">
            <span className={`stock-indicator ${product.stock > 0 ? 'in-stock' : 'no-stock'}`}></span>
            Stock: {product.stock}
          </p>
        </div>
      </div>
    </div>
  );
}
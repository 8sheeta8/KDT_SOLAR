import { useState } from 'react';
import { createProduct } from '../utils/api';
import '../styles/admin.css';

export default function Admin() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...productData,
        price: parseInt(productData.price),
        stock: parseInt(productData.stock)
      });
      alert('Product created successfully!');
      setProductData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        imageUrl: ''
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating product');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        {/* 🔥 제목을 카드 안으로 이동 */}
        <div className="admin-card">
          <h1 className="admin-title">Add New Product</h1>
          <form onSubmit={handleSubmit} className="admin-form">
            <input
              type="text"
              placeholder="Product Name"
              value={productData.name}
              onChange={(e) => setProductData({...productData, name: e.target.value})}
              className="admin-input"
              required
            />
            <textarea
              placeholder="Product Description"
              value={productData.description}
              onChange={(e) => setProductData({...productData, description: e.target.value})}
              className="admin-textarea"
              required
            />
            <input
              type="number"
              placeholder="Price ($)"
              value={productData.price}
              onChange={(e) => setProductData({...productData, price: e.target.value})}
              className="admin-input"
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={productData.stock}
              onChange={(e) => setProductData({...productData, stock: e.target.value})}
              className="admin-input"
              required
            />
            <select
              value={productData.category}
              onChange={(e) => setProductData({...productData, category: e.target.value})}
              className="admin-select"
              required
            >
              <option value="">Select Category</option>
              <option value="Solar Panels">Solar Panels</option>
              <option value="Inverters">Inverters</option>
              <option value="Batteries">Batteries</option>
              <option value="Accessories">Accessories</option>
            </select>
            <input
              type="url"
              placeholder="Image URL"
              value={productData.imageUrl}
              onChange={(e) => setProductData({...productData, imageUrl: e.target.value})}
              className="admin-input"
              required
            />
            <button type="submit" className="admin-button">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
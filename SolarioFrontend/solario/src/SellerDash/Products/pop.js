import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './popup.css';

const ProductPopup = ({ product, onClose, onUpdate }) => {
  const { id } = useParams();
  console.log("Product ID from URL:", id); // Debugging

  const [updatedProduct, setUpdatedProduct] = useState({
    price: product ? product.price : 0,
    stock_quantity: product ? product.quantity : 0,
    status: product && product.quantity > 0 ? 'In Stock' : 'Out of Stock',
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]); // Re-fetch when id changes

  const fetchProduct = async () => {
    if (!id) {
      console.error("Product ID is undefined");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/product/:${id}`);
      console.log("Product Data:", response.data); // Log the product data
      setUpdatedProduct({
        price: response.data.price,
        stock_quantity: response.data.stock_quantity,
        status: response.data.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!id) {
      console.error("Product ID is undefined");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/product/:${id}`, updatedProduct);
      fetchProduct(); // Refresh the product details
      alert("Updated Successfully");
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{product.name}</h2>
        <img
          src={`http://localhost:5000/uploads/${product.product_image}`}
          alt={product.name}
          className="product-image"
        />

        <div className="product-info">
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Category:</strong> {product.category}</p>
        </div>

        <div className="form-group">
          <label><strong>Price:</strong></label>
          <input
            type="number"
            name="price"
            value={updatedProduct.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label><strong>Stock Quantity:</strong></label>
          <input
            type="number"
            name="stock_quantity"
            value={updatedProduct.stock_quantity}
            onChange={handleInputChange}
          />
        </div>

        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default ProductPopup;
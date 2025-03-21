import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductDetailsstyle.css';

const ProductDetails = ({ productId, onClose, onUpdate, onDelete }) => {
  const [product, setProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({ price: '', stock_quantity: '' });

  // Fetch product details from the backend
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/${productId}`);
      console.log("Product Data:", response.data); // Log the product data
      setProduct(response.data);
      setUpdatedProduct({ price: response.data.price, stock_quantity: response.data.stock_quantity });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  // Handle update product
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/product/${productId}`, updatedProduct);
      setEditMode(false);
      fetchProduct(); // Refresh the product details
      if (onUpdate) onUpdate(); // Notify parent component of update
      alert("Updated Successfully");
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Handle delete product
  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/api/product/${productId}`);
      if (onDelete) onDelete(); // Notify parent component of deletion
      onClose(); // Close the product details modal
      alert("Product deleted successfully!");
    } catch (error) {
      console.error('Error deleting product:', error);
      alert("Failed to delete product.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details">
      {/* Close Button */}
      <button className="close-button" onClick={onClose}>×</button>

      <h2>{product.name}</h2>
      
      <div className="product-info">
        <p>
          <strong>Price:</strong>
          {editMode ? (
            <input
              type="number"
              value={updatedProduct.price}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
            />
          ) : (
            ` $${product.price}`
          )}
        </p>
        <p>
          <strong>Stock Quantity:</strong>
          {editMode ? (
            <input
              type="number"
              value={updatedProduct.stock_quantity}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, stock_quantity: e.target.value })}
            />
          ) : (
            ` ${product.stock_quantity}`
          )}
        </p>
        <div className="actions">
          {editMode ? (
            <>
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)}>Edit</button>
              <button onClick={handleDelete} className="delete-button">Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
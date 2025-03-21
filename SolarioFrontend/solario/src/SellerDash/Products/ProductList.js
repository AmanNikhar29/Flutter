import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './productListstyle.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // Modal state
  const [editablePrice, setEditablePrice] = useState('');
  const [editableStockQuantity, setEditableStockQuantity] = useState('');
  const navigate = useNavigate();

  // Fetch products from the backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show product details in a modal
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setEditablePrice(product.price);
    setEditableStockQuantity(product.stock_quantity);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedProduct(null);
    setEditablePrice('');
    setEditableStockQuantity('');
  };

  // Handle input changes
  const handlePriceChange = (e) => {
    setEditablePrice(e.target.value);
  };

  const handleStockQuantityChange = (e) => {
    setEditableStockQuantity(e.target.value);
  };

  // Handle update product
  const handleUpdate = async () => {
    try {
      const updatedProduct = {
        ...selectedProduct,
        price: editablePrice,
        stock_quantity: editableStockQuantity,
      };

      await axios.put(`http://localhost:5000/api/product/${selectedProduct.id}`, updatedProduct);
      fetchProducts(); // Refresh the product list
      closeModal(); // Close the modal
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this product?');
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/api/products/delProduct/${productId}`);
      fetchProducts(); // Refresh the product list
      closeModal(); // Close the modal after deletion
      alert('Product deleted successfully!');
    } catch (error) {

      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="product-list">
      {/* Go Back Button */}
      <button className="go-back-button" onClick={() => navigate('/Seller')}>
        🡰
      </button>

      <h1 className="Head">My Products</h1>
      <p className="Para">Overview for your products!</p>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          className="searchBar"
          type="text"
          placeholder="    🔍 Search products or accessories here  "
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div onClick={() => handleProductClick(product)} key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Stock Quantity: {product.stock_quantity}</p>
            {/* Delete Icon */}
            <span
              className="delete-icon"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the modal from opening
                handleDelete(product.id);
              }}
            >
              
            </span>
          </div>
        ))}
      </div>

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <img
              src={`http://localhost:5000/uploads/${selectedProduct.product_image}`}
              alt={selectedProduct.name}
              className="modal-image"
            />
            <h2>{selectedProduct.name}</h2>

            {/* Display Category (Non-Editable) */}
            <p><strong>Category:</strong> {selectedProduct.category}</p>

            {/* Display Type (Non-Editable) */}
            <p><strong>Type:</strong> {selectedProduct.type}</p>

            {/* Editable Price Field */}
            <p>
              <strong>Price:</strong>
              <input
                type="number"
                value={editablePrice}
                onChange={handlePriceChange}
              />
            </p>

            {/* Editable Stock Quantity Field */}
            <p>
              <strong>Quantity:</strong>
              <input
                type="number"
                value={editableStockQuantity}
                onChange={handleStockQuantityChange}
              />
            </p>

            {/* Display Description (Non-Editable) */}
            <p><strong>Description:</strong> {selectedProduct.description}</p>

            {/* Update Button */}
            <button className="update-button" onClick={handleUpdate}>
              Update
            </button>

            {/* Delete Button */}
            <button className="delete-button" onClick={() => handleDelete(selectedProduct.id)}>
              Delete Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
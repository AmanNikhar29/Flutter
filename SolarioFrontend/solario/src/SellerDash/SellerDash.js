import React, { useState, useEffect } from "react";
import "./Seller.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// Predefined avatars
const avatars = [
  // Add your avatar URLs here if needed
];

const SellerDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sellerName, setSellerName] = useState("");
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editablePrice, setEditablePrice] = useState('');
  const [editableStockQuantity, setEditableStockQuantity] = useState('');
  const [profileImage, setProfileImage] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch products from the backend
  useEffect(() => {
    fetchProducts();
    const storedSeller = localStorage.getItem("seller");
    if (storedSeller) {
      try {
        const seller = JSON.parse(storedSeller);
        const name = seller.first_name && seller.last_name
          ? `${seller.first_name} ${seller.last_name}`
          : "Seller";
        setSellerName(name);
      } catch (error) {
        console.error("Error parsing seller data:", error);
        setSellerName("Seller");
      }
    } else {
      setSellerName("Seller");
    }
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const sellerId = localStorage.getItem('sellerId');
      
      if (!sellerId) {
        console.error('No sellerId found');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/product/${sellerId}`);
      console.log('API Response:', response.data); // Debug log
      
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error('Unexpected response format');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setProfileImage(avatar);
    setShowAvatarPicker(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setEditablePrice(product.price);
    setEditableStockQuantity(product.stock_quantity);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setEditablePrice('');
    setEditableStockQuantity('');
  };

  const handlePriceChange = (e) => {
    setEditablePrice(e.target.value);
  };

  const handleStockQuantityChange = (e) => {
    setEditableStockQuantity(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      const updatedProduct = {
        ...selectedProduct,
        price: editablePrice,
        stock_quantity: editableStockQuantity,
      };

      await axios.put(`http://localhost:5000/api/product/${selectedProduct.id}`, updatedProduct);
      fetchProducts();
      closeModal();
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  const handleDelete = async (productId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this product?');
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/api/products/delProduct/${productId}`);
      fetchProducts();
      closeModal();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('seller');
    navigate('/login');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleAction1 = () => {
    navigate('/Product');
  };

  const handleAction3 = () => {
    navigate('/editProfile');
  };

  const handleAction4 = () => {
    navigate('/CompelteProfile');
  };

  const handleAction5 = () => {
    navigate('/Product');
  };

  const handleAction6 = () => {
    navigate('/Product');
  };

  return (
    <div className="seller-dashboard">
      {/* Drawer */}
      <div className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <button onClick={toggleDrawer} className="go-back-button-drawer">
            🡰
          </button>
          <div className="profile-section">
            <div className="profile-image">
              <img
                src={profileImage}
                alt="Profile"
                className="profile-img"
              />
              <span
                className="pencil-icon"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              >
                ✏️
              </span> 
            </div>
            {showAvatarPicker && (
              <div className="avatar-picker">
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="avatar-option"
                    onClick={() => handleAvatarSelect(avatar)}
                  />
                ))}
              </div>
            )}
            <div className="profile-info">
              <h2 className="profile-name">{sellerName}</h2>
              <p className="profile-location">Nagpur</p>
            </div>
          </div>

          <button onClick={handleAction4} className="Complete">
            Complete Your Profile
          </button>

          <p className="H1">Your Store</p><br />
          <div className="menu-item">
            <span onClick={handleAction1}>➕ Add Product</span>
            <i className="fas fa-chevron-right"></i>
          </div>
          <div className="menu-item">
            <span>🔄 Requests</span>
            <i className="fas fa-chevron-right"></i>
          </div>
          
          <p className="H1">Payments</p><br />
          <div className="menu-item">
            <span onClick={handleAction5}>💰 Your Wallet</span>
            <i className="fas fa-chevron-right"></i>
          </div>
          <div className="menu-item">
            <span onClick={handleAction6}>⏳ Payment History</span>
            <i className="fas fa-chevron-right"></i>
          </div>

          <p className="H1">Your Profile</p><br />

          <div className="drawer-menu">
            <div className="menu-item">
              <span onClick={handleAction3}>✏️ Edit Profile</span>
              <i className="fas fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <span>🔕 Notifications Setting</span>
              <i className="fas fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <span>📖 Terms and Services </span>
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isDrawerOpen ? "drawer-open" : ""}`}>
        <div className="header">
          <div className="header-left">
            <h1 className="greeting">Hi, {sellerName}</h1>
          </div>
          <div className="header-right">
            <button onClick={toggleDrawer} className="profile-button">
              <img
                src={profileImage}
                alt="Profile"
                className="profile-img"
              />
            </button>
          </div>
        </div>

        <div className="product-list">
          <h1 className="Head">My Products</h1>
          <p className="Para">Overview for your products!</p>

          <div className="search-bar">
            <input
              className="searchBar"
              type="text"
              placeholder="    🔍 Search products or accessories here  "
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="product-grid">
            {isLoading ? (
              <div className="loading-message">Loading products...</div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div onClick={() => handleProductClick(product)} key={product.id} className="product-card">
                  
                  <h3>{product.name}</h3>
                  <p>Price: ${product.price}</p>
                  <p>Stock: {product.stock_quantity}</p>
                  <span
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                  >
                  
                  </span>
                </div>
              ))
            ) : (
              <div className="no-products-message">
                {searchQuery ? 'No products match your search' : 'No products found'}
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeModal}>×</button>
                {selectedProduct.product_image && (
                  <img
                    src={`http://localhost:5000/uploads/${selectedProduct.product_image}`}
                    alt={selectedProduct.name}
                    className="modal-image"
                  />
                )}
                <h2>{selectedProduct.name}</h2>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Type:</strong> {selectedProduct.type}</p>
                <p>
                  <strong>Price:</strong>
                  <input
                    type="number"
                    value={editablePrice}
                    onChange={handlePriceChange}
                  />
                </p>
                <p>
                  <strong>Quantity:</strong>
                  <input
                    type="number"
                    value={editableStockQuantity}
                    onChange={handleStockQuantityChange}
                  />
                </p>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
                <button className="update-button" onClick={handleUpdate}>
                  Update
                </button>
                <button className="delete-button" onClick={() => handleDelete(selectedProduct.id)}>
                  Delete Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
import React, { useState, useEffect } from "react";
import "./pr.css"; // Import the CSS file
// import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [product, setProduct] = useState({
    product_id: "",
    name: "",
    category: "",
    description: "",
    type: "",
    price: "",
    stock_quantity: "",
    product_image: null,
    sellerId: "", // Auto-filled from localStorage
  });

  useEffect(() => {
    const storedSellerId = localStorage.getItem("sellerId");
    if (storedSellerId) {
      setProduct((prev) => ({ ...prev, sellerId: storedSellerId }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProduct({
      ...product,
      product_image: e.target.files[0],
    });
  };

  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sellerId = localStorage.getItem("sellerId"); // Retrieve sellerId from localStorage
    if (!sellerId) {
      alert("Seller ID is missing. Please log in again.");
      return;
    }
    else if (!product.product_image) {
      alert("Please select a product image.");
      return;
    }
    

    const formData = new FormData();
    formData.append("product_id", product.product_id);
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("type", product.type);
    formData.append("price", product.price);
    formData.append("stock_quantity", product.stock_quantity);
    formData.append("seller_id", sellerId); // Correct field name
    formData.append("product_image", product.product_image); // Match backend field name
    formData.append("description", product.description);
 // Include sellerId in the request

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Product added successfully!");
        setProduct({
          product_id: "",
          name: "",
          category: "",
          description: "",
          type: "",
          price: "",
          stock_quantity: "",
          product_image: null,
          sellerId: sellerId,
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to add product: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the product.");
    }
  };

  return (
    <div className="body">
      <h1 className="add-product-title">Add New Product</h1>
      <div className="add-product-container">
        <form >
          {/* Auto-filled Seller ID */}
          <div className="form-group">
            <label>Seller ID (Auto-filled)</label>
            <input type="text" value={product.sellerId} disabled />
          </div>

          <div className="form-group">
            <label>Product ID</label>
            <input
              type="text"
              name="product_id" // Fixed name
              value={product.product_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={product.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Solar Panels">Solar Panels</option>
              <option value="Inverters">Inverters</option>
              <option value="Batteries">Batteries</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={product.description} onChange={handleChange} rows="2" required></textarea>
          </div>

          <div className="form-group">
            <label>Type</label>
            <input type="text" name="type" value={product.type} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stock_quantity" // Fixed name
              value={product.stock_quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input type="file" name="product_image" onChange={handleImageChange} />
          </div>

          
        </form>
        
      </div>
      <button type="submit" onClick={handleSubmit} className="submit-button">Add Product</button>
    </div>
  );
};

export default AddProduct;

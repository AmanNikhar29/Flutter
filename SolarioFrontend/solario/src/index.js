import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import all your components
import Login from "./AuthPage/JS/Login";
import ForgotPassword from "./ForgotPass/Password_js/forPassPage";
import OtpVerification from "./ForgotPass/Password_js/otpVeri";
import ResetPassword from "./ForgotPass/Password_js/resetPass";
import Home from "./HomePage/MainPage";
import Register from './AuthPage/JS/Reg';
import Seller from './SellerDash/SellerDash';
import Products from './SellerDash/Products/product';
import ListPage from './SellerDash/Products/ProductList';
import ProductDetails from './SellerDash/Products/productDetails'; // Import the ProductDetails component
import Edit from './SellerDash/Products/EditProfile';
import Com from './SellerDash/Complete';
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login Page (Default Route) */}
        <Route path="/" element={<Com />} />

        {/* Forgot Password Page */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* OTP Verification Page */}
        <Route path="/verify-otp" element={<OtpVerification />} />

        {/* Reset Password Page */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Seller Dashboard */}
        <Route path="/Seller" element={<Seller />} />

        {/* Products Page */}
        <Route path="/Product" element={<Products />} />

        {/* Product List Page */}
        <Route path="/ProductList" element={<ListPage />} />

        {/* Product Details Page */}
        <Route path="/products/:id" element={<ProductDetails />} /> 5
        <Route path="/editProfile" element={<Edit />} />{/* Add this route for product details */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Seller.css"; // Import the CSS file
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SellerDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sellerName, setSellerName] = useState("");

  useEffect(() => {
    const storedSeller = localStorage.getItem("seller"); // Use the correct key
    if (storedSeller) {
      try {
        const seller = JSON.parse(storedSeller);
        // Combine first_name and last_name (or use a fallback if missing)
        const name = seller.first_name && seller.last_name
          ? `${seller.first_name} ${seller.last_name}`
          : "Seller";
        setSellerName(name);
      } catch (error) {
        console.error("Error parsing seller data from localStorage:", error);
        setSellerName("Seller"); // Fallback name
      }
    } else {
      setSellerName("Seller"); // Fallback name if no data is found
    }
  }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('seller'); // Clear seller data
    navigate('/login'); // Redirect to login page
  };


  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    
  };
  const handleAction = () => {
   navigate('/Product');
    
  };


  const [analytics, setAnalytics] = useState({
    transactionSuccess: 0,
    responseRate: 0,
    happyFeedbacks: 0,
  });
  
  useEffect(() => {
    axios.get("/api/seller/analytics")
      .then((response) => {
        setAnalytics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching analytics:", error);
      });
  }, []);

const [earnings, setEarnings] = useState({ totalBalance: 0, earnings: 0 });
const [period, setPeriod] = useState("month"); // Default to current month

useEffect(() => {
  axios.get(`/api/seller/earnings?period=${period}`)
    .then((response) => {
      setEarnings(response.data);
    })
    .catch((error) => {
      console.error("Error fetching earnings:", error);
    });
}, [period]);

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`/api/seller/history?period=${period}`)
    .then((response) => {
      setHistory(response.data);
    })
    .catch((error) => {
      console.error("Error fetching history:", error);
    });
    }, [period]);



  return (
    <div className="seller-dashboard">
      {/* Drawer */}
      <div className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-background">
            <img
              src="https://picsum.photos/seed/572/600"
              alt="Background"
              className="drawer-bg-image"
            />
            <button onClick={toggleDrawer} className="drawer-close-button">
              <i className="fas fa-chevron-left"></i>
            </button>
          </div>
          <div className="profile-section">
            <div className="profile-image">
              <img
                src="https://picsum.photos/seed/339/600"
                alt="Profile"
                className="profile-img"
              />
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{sellerName}</h2> {/* Display seller's name */}
              <p className="profile-location">Nagpur</p>
            </div>
          </div>
          
            <p className="H1">Your Store</p><br/>
            <div className="menu-item">
              <span onClick={handleAction}>➕ Add Product</span>
              <i className="fas fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <span>📦 View Products</span>
              <i className="fas fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <span>🔄 Requests</span>
              <i className="fas fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <span>🔔 Notifications</span>
              <i className="fas fa-chevron-right"></i>
            </div>
            <p className="H1">Payments</p><br/>
            <div className="menu-item">
              <span>💰 Your Wallet</span>
              <i className="fas fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <span>⏳ Payment History</span>
              <i className="fas fa-chevron-right"></i>
            </div>
  
            <p className="H1">Your Profile</p><br/>
          
          <div className="drawer-menu">
            <div className="menu-item">
              <span>✏️ Edit Profile</span>
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
          <button onClick={handleLogout}  className="logout-button">Log Out</button>
        </div>
        
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <h1 className="greeting">Hi, {sellerName}</h1> {/* Display seller's name */}
            <p className="date">{currentDate}</p>
          </div>
          <div className="header-right">
            <button onClick={toggleDrawer} className="profile-button">
              <img
                src="https://picsum.photos/seed/572/600"
                alt="Profile"
                className="profile-img"
              />
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        <select onChange={(e) => setPeriod(e.target.value)}>
        <option value="day">Today</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
</select>
        <div className="analytics-section">
          <h2 className="section-title">Analytics</h2>
          <div className="analytics-cards">
            <motion.div
              className="analytics-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>97.20%</h3>
              <p>Transaction success</p>
            </motion.div>
            <motion.div
              className="analytics-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>97.20%</h3>
              <p>Response rate</p>
            </motion.div>
            <motion.div
              className="analytics-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>97.20%</h3>
              <p>Happy Feedbacks</p>
            </motion.div>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="earnings-section">
          <h2 className="section-title">Earnings</h2>
          <div className="earnings-card">
            <p>Total balance</p>
            <h3>₹5000.00</h3>
          </div>
          <div className="earnings-chart">
            <p>Earning in February</p>
            <h3>₹2500.25</h3>
            {/* Placeholder for Chart */}
            <div className="chart-placeholder"></div>
          </div>
        </div>

        {/* History Section */}
        <div className="history-section">
          <h2 className="section-title">History</h2>
          <div className="history-list">
  {history.map((item) => (
    <div key={item.id} className="history-item">
      <p>Payment from {item.customer}</p>
      <p>₹{item.amount.toFixed(2)}</p>
      <p>{new Date(item.date).toLocaleDateString()}</p>
    </div>
  ))}
</div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
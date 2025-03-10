const db = require('../../../config/db');

// Helper functions
const calculateSuccessRate = (transactions) => {
  // Placeholder logic to calculate transaction success rate
  return 97.2; // Example value
};

const calculateResponseRate = (feedbacks) => {
  // Placeholder logic to calculate response rate
  return 95.5; // Example value
};

const calculateHappyFeedbacks = (feedbacks) => {
  // Placeholder logic to calculate happy feedbacks
  return 98.1; // Example value
};

const calculateEarnings = async (sellerId, period) => {
  // Placeholder logic to calculate earnings based on period
  return { totalBalance: 5000, earnings: 2500.25 }; // Example values
};

const getStartDate = (period) => {
  // Logic to calculate the start date based on period (day, month, year)
  const now = new Date();
  if (period === "day") return new Date(now.setHours(0, 0, 0, 0));
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === "year") return new Date(now.getFullYear(), 0, 1);
  return new Date(0); // Default to the earliest date
};

const getSellerDetails = async (req, res) => {
    try {
      const sellerId = req.user.id; // Assuming you're using authentication
      const [seller] = await db.execute(
        "SELECT first_name, last_name, store_name, store_address FROM Seller WHERE id = ?",
        [sellerId]
      );
  
      if (seller.length === 0) {
        return res.status(404).json({ message: "Seller not found" });
      }
  
      res.json({
        first_name: seller[0].first_name,
        last_name: seller[0].last_name,
        store_name: seller[0].store_name,
        store_address: seller[0].store_address,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching seller details", error });
    }
  };

  const getSellerAnalytics = async (req, res) => {
    try {
      const sellerId = req.user.id;
  
      // Fetch transactions
      const [transactions] = await db.execute(
        "SELECT * FROM Transaction WHERE sellerId = ?",
        [sellerId]
      );
  
      // Fetch feedbacks
      const [feedbacks] = await db.execute(
        "SELECT * FROM Feedback WHERE sellerId = ?",
        [sellerId]
      );
  
      // Calculate analytics
      const transactionSuccess = calculateSuccessRate(transactions);
      const responseRate = calculateResponseRate(feedbacks);
      const happyFeedbacks = calculateHappyFeedbacks(feedbacks);
  
      res.json({ transactionSuccess, responseRate, happyFeedbacks });
    } catch (error) {
      res.status(500).json({ message: "Error fetching analytics", error });
    }
  };


const getSellerEarnings = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { period } = req.query;

    // Placeholder logic to calculate earnings
    const earnings = await calculateEarnings(sellerId, period);

    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching earnings", error });
  }
};

// API: Get seller transaction history
const getSellerHistory = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { period } = req.query;

    // Calculate start date based on period
    const startDate = getStartDate(period);

    // Fetch transaction history (placeholder query)
    const [history] = await db.execute(
      "SELECT * FROM Transaction WHERE sellerId = ? AND date >= ?",
      [sellerId, startDate]
    );

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error });
  }
};

module.exports = {
  getSellerDetails,
  getSellerAnalytics,
  getSellerEarnings,
  getSellerHistory,
};
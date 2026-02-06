const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 🔌 IMPORT ROUTES
const snackRoutes = require('./routes/snackRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// 🛠️ MIDDLEWARE (Crucial: Must be above routes)
app.use(cors()); 
app.use(express.json()); 

// 🚀 REGISTER ROUTES
// This handles your menu items (Lays, Popcorn, etc.)
app.use('/api/products', snackRoutes); 

// This handles your Razorpay checkout and admin order list
app.use('/api/orders', orderRoutes); 

// 💾 DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI || 'your_mongodb_connection_string')
  .then(() => {
    console.log("✅ Connected to MongoDB! 🍟");
  })
  .catch(err => {
    console.error("❌ Database Connection Error:", err);
  });

// 🌐 SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server active on port ${PORT}`);
    console.log(`📡 Order Endpoint: http://localhost:${PORT}/api/orders`);
    console.log(`📡 Checkout Endpoint: http://localhost:${PORT}/api/orders/checkout`);
});
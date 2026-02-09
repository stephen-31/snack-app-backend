const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 🔌 IMPORT ROUTES
const snackRoutes = require('./routes/snackRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// 🛠️ MIDDLEWARE (Updated for Vercel + Render Connection)
app.use(cors({
  origin: [
    'https://hungerhunt-admin.vercel.app', 
    'https://hungerhunt-student.vercel.app',
    'http://localhost:3000' // Keeps local testing working
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})); 

app.use(express.json()); 

// 🚀 REGISTER ROUTES
app.use('/api/products', snackRoutes); 
app.use('/api/orders', orderRoutes); 

// 💾 DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
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
});
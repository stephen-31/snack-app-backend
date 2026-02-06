const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Grouped student info for better data organization
  student: {
    name: { type: String, required: true },
    school: { type: String, required: true },
    grade: { type: String, required: true }
  },
  
  // Detailed items array to track exactly what was ordered and at what price
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true }
    }
  ],

  // Financial breakdown
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  finalTotal: { type: Number, required: true },

  // Payment Tracking
  razorpayOrderId: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed'], 
    default: 'Pending' 
  },
  
  // Fulfillment Tracking
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'], 
    default: 'Pending' 
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
const mongoose = require('mongoose');

const snackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: { 
    type: String, 
    required: true, 
    // UPDATED: Added your new categories here so MongoDB accepts them
    enum: ['Health Care', 'Dry Fruits', 'Stationery', 'Fruits', 'Biscuits', 'Snacks', 'Drinks', 'Meals', 'Healthy', 'Sweet'], 
    default: 'Snacks' 
  },
  image: { 
    type: String, 
    default: 'https://via.placeholder.com/150' 
  },
  quantity: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Snack', snackSchema);
const mongoose = require('mongoose');

const snackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  // Combined categories for a better menu
  category: { 
    type: String, 
    required: true, 
    enum: ['Snacks', 'Drinks', 'Meals', 'Healthy', 'Sweet'], 
    default: 'Snacks' 
  },
  image: { 
    type: String, 
    default: 'https://via.placeholder.com/150' 
  },
  // Essential for the kitchen to track what's left
  quantity: { type: Number, default: 0 },
  // Important so students don't order what you don't have
  inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Snack', snackSchema);
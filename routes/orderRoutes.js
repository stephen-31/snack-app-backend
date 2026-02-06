const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Snack'); 

const RAZORPAY_KEY_ID = 'rzp_test_SCORIMZ4cVB8Xj';
const RAZORPAY_KEY_SECRET = '14LoBjoc4MmhnC38tOfxK3Li';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// --- 📊 ADMIN: Fetch All Orders ---
// URL: GET http://localhost:5000/api/orders
router.get('/', async (req, res) => {
  try {
    // Only show 'Paid' orders to the admin to avoid pending clutter
    const orders = await Order.find({ paymentStatus: 'Paid' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 💳 CHECKOUT: Create Razorpay Order ---
// URL: POST http://localhost:5000/api/orders/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { finalTotal, student, items, subtotal, deliveryCharge } = req.body;
    const options = {
      amount: Math.round(finalTotal * 100), 
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = new Order({
      student, 
      items, 
      subtotal, 
      deliveryCharge, 
      finalTotal,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'Pending'
    });
    await newOrder.save();

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key_id: RAZORPAY_KEY_ID 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ✅ VERIFY: Confirm Payment Signature ---
// URL: POST http://localhost:5000/api/orders/verify
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id }, 
        { paymentStatus: 'Paid' }
      );
      return res.json({ success: true, message: "Payment Verified" });
    }
    res.status(400).json({ success: false, message: "Invalid Signature" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 📦 STATUS: Update Order (e.g., mark as 'Delivered') ---
// URL: PUT http://localhost:5000/api/orders/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 🗑️ DELETE: Remove Order Record ---
// URL: DELETE http://localhost:5000/api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
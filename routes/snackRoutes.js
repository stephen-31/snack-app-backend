const express = require('express');
const router = express.Router();
const Snack = require('../models/Snack');

// GET all snacks
router.get('/', async (req, res) => {
  try {
    const snacks = await Snack.find();
    res.json(snacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new snack (Admin only in the future)
router.post('/', async (req, res) => {
  try {
    const newSnack = new Snack(req.body);
    const savedSnack = await newSnack.save();
    res.status(201).json(savedSnack);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a snack by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSnack = await Snack.findByIdAndDelete(req.params.id);
    if (!deletedSnack) {
      return res.status(404).json({ message: "Snack not found" });
    }
    res.json({ message: "Snack deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// PATCH: Toggle inStock status
router.patch('/:id/toggle-stock', async (req, res) => {
  try {
    const snack = await Snack.findById(req.params.id);
    if (!snack) return res.status(404).json({ message: "Snack not found" });

    snack.inStock = !snack.inStock; // Flip the true/false value
    await snack.save();
    res.json(snack);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Backend: Ensure you have this EXACT route
router.put('/:id', async (req, res) => {
  try {
    // { new: true } is the secret—it tells MongoDB to return the UPDATED version
    const updatedSnack = await Snack.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } 
    );
    
    if (!updatedSnack) {
      return res.status(404).json({ message: "Snack not found" });
    }
    
    res.json(updatedSnack);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});
module.exports = router;
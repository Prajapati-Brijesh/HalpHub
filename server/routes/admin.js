const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all bookings (Admin only)
router.get('/bookings', auth, admin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('service');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status
router.put('/bookings/:id', auth, admin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Manage services
router.delete('/services/:id', auth, admin, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

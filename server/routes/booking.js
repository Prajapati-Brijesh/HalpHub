const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Create a booking
router.post('/', auth, async (req, res) => {
  const booking = new Booking({
    ...req.body,
    user: req.user.id
  });
  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user bookings
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('service');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

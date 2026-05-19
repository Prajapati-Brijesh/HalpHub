const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Get reviews for a service
router.get('/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a review
router.post('/', auth, async (req, res) => {
  const review = new Review({
    ...req.body,
    user: req.user.id
  });
  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

const { Review, Booking, Product, User } = require('../models');

// [POST] Create review (customer only, booking must be COMPLETED)
const createReview = async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;
    const customer_id = req.user.id;

    if (!booking_id || !rating) {
      return res.status(400).json({ message: 'booking_id and rating are required!' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5!' });
    }

    // Verify booking belongs to this customer and is COMPLETED
    const booking = await Booking.findOne({ where: { id: booking_id, customer_id } });
    if (!booking) return res.status(404).json({ message: 'Booking not found!' });
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'You can only review completed bookings!' });
    }

    // Check not already reviewed
    const existing = await Review.findOne({ where: { booking_id } });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this booking!' });

    const review = await Review.create({ booking_id, customer_id, rating, comment });
    res.status(201).json({ message: 'Review submitted successfully!', data: review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [GET] Get reviews for a product (public)
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({
      include: [
        { model: Booking, as: 'booking', where: { product_id: productId }, attributes: [] },
        { model: User, as: 'customer', attributes: ['full_name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ data: reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createReview, getProductReviews };

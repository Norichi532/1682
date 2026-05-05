const express = require('express');
const router = express.Router();
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, verifyRole([2]), createReview);
router.get('/product/:productId', getProductReviews);

module.exports = router;

const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { verifyToken } = require('../middlewares/authMiddleware');

// POST /api/upload
router.post('/', verifyToken, upload.single('image'), uploadImage);

// DELETE /api/upload
router.delete('/', verifyToken, deleteImage);

module.exports = router;

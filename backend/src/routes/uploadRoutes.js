const express = require('express');
const router = express.Router();
const { createUploader, cloudinary } = require('../middleware/upload');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { verifyToken } = require('../middlewares/authMiddleware');

const FOLDERS = {
  car_models: 'phuong_tourist_car/car_models',
  cars:       'phuong_tourist_car/cars',
  products:   'phuong_tourist_car/products',
  avatars:    'phuong_tourist_car/avatars',
};

router.post('/car_models', verifyToken, createUploader(FOLDERS.car_models).single('image'), uploadImage);
router.post('/cars',       verifyToken, createUploader(FOLDERS.cars).single('image'),       uploadImage);
router.post('/products',   verifyToken, createUploader(FOLDERS.products).single('image'),   uploadImage);
router.post('/avatars',    verifyToken, createUploader(FOLDERS.avatars).single('image'),    uploadImage);

router.delete('/', verifyToken, deleteImage);

module.exports = router;

// src/controllers/categoryController.js
const { Category } = require('../models');

// [GET] Get all categories
const getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAll };

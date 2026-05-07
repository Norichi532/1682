const { Product, Category, PriceList, CarModel } = require('../models');

const productIncludes = [
  { model: Category, as: 'category', attributes: ['id', 'category_name'] },
  {
    model: PriceList, as: 'prices',
    include: [{ model: CarModel, as: 'car_model', attributes: ['id', 'model_name', 'num_seats', 'image_url'] }],
    attributes: ['id', 'price', 'model_id']
  }
];

const getAllProducts = async (req, res) => {
  try {
    const { category_id } = req.query;
    const where = {};
    if (category_id) where.category_id = category_id;
    const products = await Product.findAll({ where, include: productIncludes, order: [['id', 'ASC']] });
    res.json({ message: 'OK', data: products });
  } catch (e) { res.status(500).json({ message: e.message, detail: e.toString(), stack: e.stack }); }
};

const getProductById = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id, { include: productIncludes });
    if (!p) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json({ message: 'OK', data: p });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const createProduct = async (req, res) => {
  try {
    const { category_id, product_name, description, address, image_url, prices, num_days } = req.body;
    if (!category_id || !product_name) return res.status(400).json({ message: 'category_id và product_name là bắt buộc' });
    // num_days chỉ dùng cho Tour (category_id = 2)
    const parsedNumDays = parseInt(category_id) === 2 && num_days ? parseInt(num_days) : null;
    const p = await Product.create({ category_id, product_name, description, address, image_url, num_days: parsedNumDays });
    // Create price list entries if provided
    if (prices && Array.isArray(prices)) {
      const priceRows = prices.map(pr => ({ product_id: p.id, model_id: pr.model_id, price: pr.price }));
      await PriceList.bulkCreate(priceRows);
    }
    const full = await Product.findByPk(p.id, { include: productIncludes });
    res.status(201).json({ message: 'Tạo sản phẩm thành công', data: full });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateProduct = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Không tìm thấy' });
    const { category_id, product_name, description, address, image_url, prices, num_days } = req.body;
    const parsedNumDays = parseInt(category_id) === 2 && num_days ? parseInt(num_days) : null;
    await p.update({ category_id, product_name, description, address, image_url, num_days: parsedNumDays });
    // Update prices: delete old, insert new
    if (prices && Array.isArray(prices)) {
      await PriceList.destroy({ where: { product_id: p.id } });
      const priceRows = prices.map(pr => ({ product_id: p.id, model_id: pr.model_id, price: pr.price }));
      await PriceList.bulkCreate(priceRows);
    }
    const full = await Product.findByPk(p.id, { include: productIncludes });
    res.json({ message: 'Cập nhật thành công', data: full });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteProduct = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Không tìm thấy' });
    await PriceList.destroy({ where: { product_id: p.id } });
    await p.destroy();
    res.json({ message: 'Xóa thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };

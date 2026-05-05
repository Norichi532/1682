const { CarModel } = require('../models');

const getAll = async (req, res) => {
  try {
    const models = await CarModel.findAll({ order: [['num_seats', 'ASC']] });
    res.json({ message: 'OK', data: models });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const getById = async (req, res) => {
  try {
    const m = await CarModel.findByPk(req.params.id);
    if (!m) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'OK', data: m });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const create = async (req, res) => {
  try {
    const { model_name, num_seats, description, features, image_url } = req.body;
    if (!model_name || !num_seats) return res.status(400).json({ message: 'model_name và num_seats là bắt buộc' });
    const m = await CarModel.create({ model_name, num_seats, description, features, image_url });
    res.status(201).json({ message: 'Tạo dòng xe thành công', data: m });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const update = async (req, res) => {
  try {
    const m = await CarModel.findByPk(req.params.id);
    if (!m) return res.status(404).json({ message: 'Không tìm thấy' });
    const { model_name, num_seats, description, features, image_url } = req.body;
    await m.update({ model_name, num_seats, description, features, image_url });
    res.json({ message: 'Cập nhật thành công', data: m });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const remove = async (req, res) => {
  try {
    const m = await CarModel.findByPk(req.params.id);
    if (!m) return res.status(404).json({ message: 'Không tìm thấy' });
    await m.destroy();
    res.json({ message: 'Xóa thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getAll, getById, create, update, remove };

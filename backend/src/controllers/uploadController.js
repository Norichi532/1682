const { cloudinary } = require('../middleware/upload');

// [POST] Upload single image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({
      message: 'Image uploaded successfully',
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// [DELETE] Delete image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ message: 'public_id is required' });
    }
    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

module.exports = { uploadImage, deleteImage };

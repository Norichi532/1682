// src/controllers/notificationController.js
const { Notification } = require('../models');

// [GET] Get notifications for current user
const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;

    const notifications = await Notification.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      limit: 20
    });

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [PATCH] Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const notification = await Notification.findOne({
      where: { id, user_id }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found!' });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [PATCH] Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;

    await Notification.update(
      { is_read: true },
      { where: { user_id, is_read: false } }
    );

    res.status(200).json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};

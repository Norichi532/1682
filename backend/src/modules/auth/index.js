const User = require('../user/user.model');
const authController = require('./auth.controller');
const authRoutes = require('./auth.routes');

module.exports = {
  User,
  authController,
  authRoutes,
};
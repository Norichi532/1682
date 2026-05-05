// models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    role_id: { type: DataTypes.INTEGER, defaultValue: 3 }, // Mặc định 3 là CUSTOMER
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255) },
    phone: { type: DataTypes.STRING(20) },
    avatar_url: { type: DataTypes.TEXT },
    google_id: { type: DataTypes.STRING(255), unique: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = function(models) {
    // User thuộc về 1 Role nhất định
    User.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
    
    // Nếu User là tài xế, họ có thể được phân công lái nhiều xe khác nhau
    User.hasMany(models.Car, { foreignKey: 'driver_id', as: 'driven_cars' });
  };

  return User;
};
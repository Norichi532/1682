// models/Role.js
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    role_name: { type: DataTypes.STRING(50), unique: true, allowNull: false }
  }, {
    tableName: 'roles',
    timestamps: false // Bảng này không có created_at, updated_at
  });

  Role.associate = function(models) {
    // 1 Role có thể được gán cho nhiều User
    Role.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });
  };

  return Role;
};
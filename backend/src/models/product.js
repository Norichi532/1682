// models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    product_name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    address: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.TEXT },
    num_days: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    itinerary: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] }
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    Product.hasMany(models.PriceList, { foreignKey: 'product_id', as: 'prices' });
    Product.hasMany(models.Booking, { foreignKey: 'product_id', as: 'bookings' });
  };

  return Product;
};
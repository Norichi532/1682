// models/PriceList.js
module.exports = (sequelize, DataTypes) => {
  const PriceList = sequelize.define('PriceList', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    model_id: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
  }, {
    tableName: 'price_list',
    timestamps: false
  });

  PriceList.associate = function(models) {
    PriceList.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    PriceList.belongsTo(models.CarModel, { foreignKey: 'model_id', as: 'car_model' });
  };

  return PriceList;
};
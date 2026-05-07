'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('car_models', 'images', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('car_models', 'images');
  }
};

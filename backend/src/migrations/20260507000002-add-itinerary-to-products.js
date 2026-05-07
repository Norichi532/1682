'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'itinerary', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'itinerary');
  }
};

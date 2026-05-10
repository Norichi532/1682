'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'num_days', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: 'Số ngày tour (chỉ dùng cho category Tour, null với dịch vụ khác)'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'num_days');
  }
};

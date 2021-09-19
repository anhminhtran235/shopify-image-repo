'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('image_label', {
      imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'images', key: 'id' },
        onDelete: 'CASCADE',
      },
      labelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'labels', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('image_label');
  },
};

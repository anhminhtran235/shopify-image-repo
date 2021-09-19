'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Label extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Image }) {
      // define association here
      this.belongsToMany(Image, {
        through: 'image_label',
        as: 'images',
        onDelete: 'CASCADE',
      });
    }
  }
  Label.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'labels',
      modelName: 'Label',
    }
  );
  return Label;
};

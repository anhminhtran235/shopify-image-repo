'use strict';
const { Model } = require('sequelize');
const { shallowCloneRemoveFields } = require('../util');
const { getCloudFrontUrl } = require('../S3/s3');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }

    toJSON() {
      const image = shallowCloneRemoveFields(this.get(), 'id', 'userId');
      image.url = getCloudFrontUrl(image.awsKey);
      return image;
    }
  }
  Image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      awsKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'images',
      modelName: 'Image',
    }
  );
  return Image;
};

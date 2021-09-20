const { Image } = require('../models');

const createOne = (image) => {
  return Image.create(image);
};

const findAll = (option) => {
  return Image.findAll(option);
};

module.exports = {
  createOne,
  findAll,
};

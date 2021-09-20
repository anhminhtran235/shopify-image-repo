const { Label } = require('../models');

const findAll = (option) => {
  return Label.findAll(option);
};

const bulkCreate = (labels) => {
  return Label.bulkCreate(labels);
};

module.exports = {
  findAll,
  bulkCreate,
};

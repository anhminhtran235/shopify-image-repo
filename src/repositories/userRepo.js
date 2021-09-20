const { User } = require('../models');

const findOne = (option) => {
  return User.findOne(option);
};

const findAll = (option) => {
  return User.findAll(option);
};

const createOne = (user) => {
  return User.create(user);
};

module.exports = {
  findOne,
  findAll,
  createOne,
};

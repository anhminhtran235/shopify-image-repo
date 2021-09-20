const { sequelize } = require('../models/index');

const executeQuery = (query, option) => {
  return sequelize.query(query, option);
};

module.exports = {
  executeQuery,
};

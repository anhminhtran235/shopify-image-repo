const { sequelize, User, Image, Label } = require('../models');

const teardown = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then(async () => {
        console.log('Tearing down the database');
        await User.destroy({ where: {}, truncate: { cascade: true } });
        await Image.destroy({ where: {}, truncate: { cascade: true } });
        await Label.destroy({ where: {}, truncate: { cascade: true } });
        resolve('');
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = teardown;

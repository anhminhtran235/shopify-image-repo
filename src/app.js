const express = require('express');
const { sequelize } = require('./models');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to MySql...');
  })
  .catch((err) => {
    throw err;
  });

const app = express();
app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/images', require('./routes/images'));

module.exports = app;

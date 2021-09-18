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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use('/users', require('./routes/users'));
app.use('/images', require('./routes/images'));

module.exports = app;

const express = require('express');
const { sequelize } = require('./models');
const path = require('path');

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
app.use('/search', require('./routes/search'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '..', 'client', 'build', 'index.html')
    );
  });
}

module.exports = app;

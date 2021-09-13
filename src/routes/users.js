const express = require('express');
const router = express.Router();
const { User, Image } = require('../models');

const { defaultExpressErrorHandler } = require('../util');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ include: 'images' });

    return res.json(users);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

router.post('/', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.create({ name, password });

    return res.json(user);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

router.put('/', async (req, res) => {
  const { uuid, name, password } = req.body;
  try {
    const user = await User.findOne({ where: { uuid } });
    if (!user) {
      res.status(400).json({ message: `No user with uuid ${uuid} found` });
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    return res.json(user);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

module.exports = router;

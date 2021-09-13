const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

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

router.post(
  '/login',
  [
    check('name', 'User name is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, password } = req.body;
      const user = await User.findOne({ where: { name } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const payload = {
        user: {
          uuid: user.uuid,
        },
      };

      jwt.sign(
        payload,
        config.get('jsonSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ user, token });
        }
      );
    } catch (error) {
      return defaultExpressErrorHandler(res, error);
    }
  }
);

router.post(
  '/register',
  [
    check('name', 'User name is required').not().isEmpty(),
    check('password', 'Password must have 6 or more characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, password } = req.body;
      if (await User.findOne({ where: { name } })) {
        return res
          .status(400)
          .json({ message: `User with name ${name} already exists` });
      }

      let user = {
        name,
      };
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user = await User.create(user);

      const payload = {
        user: {
          uuid: user.uuid,
        },
      };

      jwt.sign(
        payload,
        config.get('jsonSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ user, token });
        }
      );
    } catch (error) {
      return defaultExpressErrorHandler(res, error);
    }
  }
);

module.exports = router;

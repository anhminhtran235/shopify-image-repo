const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const userService = require('../services/userService');
const {
  defaultExpressErrorHandler,
  defaultRequestValidator,
} = require('../util');
const auth = require('../middleware/auth');

// Get my info
router.get('/me', auth, async (req, res) => {
  try {
    const { uuid } = req.user;
    const user = await userService.getMyInfo(uuid);
    return res.json(user);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

// Login
router.post(
  '/login',
  [
    check('name', 'User name is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    try {
      defaultRequestValidator(req);

      const { name, password } = req.body;
      const response = await userService.login(name, password);
      res.json(response);
    } catch (error) {
      return defaultExpressErrorHandler(res, error);
    }
  }
);

// Register
router.post(
  '/register',
  [
    check('name', 'User name is required').not().isEmpty(),
    check('password', 'Password must have 6 or more characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      defaultRequestValidator(req);

      const { name, password } = req.body;
      const response = await userService.register(name, password);
      res.json(response);
    } catch (error) {
      return defaultExpressErrorHandler(res, error);
    }
  }
);

module.exports = router;

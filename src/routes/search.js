const express = require('express');
const router = express.Router();
const { Label } = require('../models');
const { Op } = require('sequelize');

const { defaultExpressErrorHandler } = require('../util');

// Get labels
router.get('/labels', async (req, res) => {
  try {
    const { name } = req.query;

    const labels = await Label.findAll({
      where: { name: { [Op.like]: `%${name}%` } },
    });

    return res.json(labels);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

module.exports = router;

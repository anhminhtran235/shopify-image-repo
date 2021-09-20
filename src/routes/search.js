const express = require('express');
const router = express.Router();

const { defaultExpressErrorHandler } = require('../util');
const labelService = require('../services/labelService');
const imageService = require('../services/imageService');

// Get labels
router.get('/labels', async (req, res) => {
  try {
    const { name } = req.query;
    const labels = await labelService.findAllMatchingLabels(name);
    return res.json(labels);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

// Get images with pagination and query
router.get('/', async (req, res) => {
  try {
    let { offset, limit, searchText, label } = req.query;
    const images = await imageService.getImagesFromSearchQueries(
      offset,
      limit,
      searchText,
      label
    );
    return res.json(images);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

module.exports = router;

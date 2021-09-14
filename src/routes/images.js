const express = require('express');
const router = express.Router();
const { User, Image } = require('../models');
const { check, validationResult } = require('express-validator');

const { defaultExpressErrorHandler } = require('../util');
const auth = require('../middleware/auth');
const { uploadBase64Image, getCloudFrontUrl } = require('../S3/s3');

// Get all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.findAll({
      include: 'user',
    });
    return res.json(images);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

// Upload new image
router.post(
  '/upload',
  [
    auth,
    check('imageBase64', 'Image is required').not().isEmpty(),
    check('filename', 'Filename is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { imageBase64, filename } = req.body;
      const { uuid } = req.user;

      const user = await User.findOne({ where: { uuid } });
      if (!user) {
        return res.status(400).json({ message: 'Your account does not exist' });
      }

      const uploadResult = await uploadBase64Image(imageBase64);

      const image = await Image.create({
        filename,
        awsKey: uploadResult.Key,
        userId: user.id,
      });

      const cloudFrontUrl = getCloudFrontUrl(image.awsKey);
      return res.json({ filename: image.filename, url: cloudFrontUrl });
    } catch (error) {
      return defaultExpressErrorHandler(res, error);
    }
  }
);

// Delete images
router.delete('/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;

    const image = await Image.findOne({ where: { uuid } });
    if (!image) {
      return res
        .status(400)
        .json(`Image with uuid ${imageUUID} does not exist`);
    }

    await image.destroy();
    res.status(200).send();
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

module.exports = router;

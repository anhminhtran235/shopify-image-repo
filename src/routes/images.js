const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  defaultExpressErrorHandler,
  defaultRequestValidator,
} = require('../util');
const auth = require('../middleware/auth');
const imageService = require('../services/imageService');

// Upload new image
router.post(
  '/upload',
  [
    auth,
    check('imageBase64', 'Image is required').not().isEmpty(),
    check('filename', 'Filename is required').not().isEmpty(),
    check('tempUUID', 'TempUUID is required').not().isEmpty(),
  ],
  async (req, res) => {
    try {
      defaultRequestValidator(req);
      const { imageBase64, filename, tempUUID, runAWSRecoknition } = req.body;
      const { uuid } = req.user;
      const response = await imageService.uploadImage(
        imageBase64,
        filename,
        tempUUID,
        runAWSRecoknition,
        uuid
      );

      return res.json(response);
    } catch (error) {
      defaultExpressErrorHandler(res, error);
    }
  }
);

// Delete multiple images
router.delete('/', auth, async (req, res) => {
  try {
    const { imageUUIDs } = req.body;
    const { uuid: userUUID } = req.user;
    const results = await imageService.deleteImages(imageUUIDs, userUUID);
    res.status(200).json(results);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

// Delete all images
router.delete('/all', auth, async (req, res) => {
  try {
    const { uuid: userUUID } = req.user;
    const results = await imageService.deleteAllImagesOfUser(userUUID);
    res.status(200).json(results);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

module.exports = router;

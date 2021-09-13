const express = require('express');
const router = express.Router();
const { User, Image } = require('../models');

const { defaultExpressErrorHandler } = require('../util');

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

router.post('/', async (req, res) => {
  try {
    const { userUUID } = req.body;

    const user = await User.findOne({ where: { uuid: userUUID } });
    const image = await Image.create({
      filename: 'abc',
      awsKey: 'ldsfkjfdslk',
      userId: user.id,
    });

    return res.json(image);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

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

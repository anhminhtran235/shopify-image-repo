const express = require('express');
const router = express.Router();
const { User, Image, Label } = require('../models');
const { check, validationResult } = require('express-validator');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/index');

const { defaultExpressErrorHandler } = require('../util');
const auth = require('../middleware/auth');
const {
  uploadBase64Image,
  getCloudFrontUrl,
  deleteImages,
} = require('../S3/s3');

const { detectLabels } = require('../AmazonRecoknition/AmazonRecoknition');

// Get images with pagination and query
router.get('/', async (req, res) => {
  try {
    let { offset, limit, searchText, label } = req.query;
    if (!offset) {
      offset = 0;
    }
    if (!limit) {
      limit = 10000000000000;
    }

    let queryString = `SELECT DISTINCT \`Image\`.\`uuid\` as uuid,
                                \`Image\`.\`filename\` as filename,
                                \`Image\`.\`awskey\` as awsKey,
                                \`Image\`.\`createdat\` as createdAt,
                                \`Image\`.\`updatedat\` as updatedAt,
                                \`user\`.\`uuid\`                   AS \`user.uuid\`,
                                \`user\`.\`name\`                   AS \`user.name\`,
                                \`user\`.\`createdat\`              AS \`user.createdAt\`,
                                \`user\`.\`updatedat\`              AS \`user.updatedAt\`
                                FROM   \`images\` AS \`Image\`
                                LEFT OUTER JOIN \`users\` AS \`user\`
                                            ON \`Image\`.\`userid\` = \`user\`.\`id\`
                                INNER JOIN ( \`image_label\` INNER JOIN \`labels\`
                                                    ON \`labels\`.\`id\` = \`image_label\`.\`labelid\`)
                                        ON \`Image\`.\`id\` = \`image_label\`.\`imageid\``;
    if (searchText) {
      queryString += `WHERE  ( \`user\`.\`name\` LIKE '%${searchText}%'
      OR \`Image\`.\`filename\` LIKE '%${searchText}%' )`;
    }
    if (label) {
      queryString += `AND \`labels\`.\`name\` = '${label}'`;
    }

    queryString += ` ORDER  BY \`Image\`.\`createdat\` DESC
    LIMIT ${limit} OFFSET ${offset}`;

    const images = await sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });

    const beautifiedImages = [];
    images.forEach((image) => {
      const beautifiedImage = {};
      beautifiedImage.uuid = image.uuid;
      beautifiedImage.filename = image.filename;
      beautifiedImage.awsKey = image.awsKey;
      beautifiedImage.createdAt = image.createdAt;
      beautifiedImage.updatedAt = image.updatedAt;
      beautifiedImage.url = getCloudFrontUrl(beautifiedImage.awsKey);

      beautifiedImage.user = {};
      beautifiedImage.user.uuid = image['user.uuid'];
      beautifiedImage.user.name = image['user.name'];
      beautifiedImage.user.createdAt = image['user.createdAt'];
      beautifiedImage.user.updatedAt = image['user.updatedAt'];

      beautifiedImages.push(beautifiedImage);
    });
    console.log(beautifiedImages);

    return res.json(beautifiedImages);
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
    check('tempUUID', 'TempUUID is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { imageBase64, filename, tempUUID } = req.body;

    try {
      const { uuid } = req.user;

      const user = await User.findOne({ where: { uuid } });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Your account does not exist' }] });
      }

      const uploadResult = await uploadBase64Image(imageBase64);

      const image = await Image.create({
        filename,
        awsKey: uploadResult.Key,
        userId: user.id,
      });

      const result = await detectLabels(uploadResult.Key);
      const labelNames = result.Labels.map((label) => label.Name);
      const existingLabels = await Label.findAll({
        where: { name: labelNames },
      });
      const existingLabelNames = existingLabels.map((label) => label.name);
      const newLabelNames = labelNames.filter(
        (labelName) => !existingLabelNames.includes(labelName)
      );
      const newLabels = await Label.bulkCreate(
        newLabelNames.map((labelName) => ({ name: labelName }))
      );

      const allLabels = [...existingLabels, newLabels];
      for (let i = 0; i < allLabels.length; i++) {
        await image.addLabel(allLabels[i]);
      }

      const cloudFrontUrl = getCloudFrontUrl(image.awsKey);
      return res.json({ url: cloudFrontUrl, tempUUID, ...image.toJSON() });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ errors: [{ msg: 'Something went wrong' }], tempUUID });
    }
  }
);

// Delete multiple images
router.delete('/', auth, async (req, res) => {
  try {
    const { imageUUIDs } = req.body;
    const { uuid: userUUID } = req.user;

    const images = await Image.findAll({
      where: { uuid: imageUUIDs },
      include: 'user',
    });

    const promiseList = [];
    const awsKeysToDelete = [];
    images.forEach((image) => {
      const isImageOwnedByUser = image.user.uuid === userUUID;
      if (isImageOwnedByUser) {
        promiseList.push(image.destroy());
        awsKeysToDelete.push(image.awsKey);
      }
    });
    const results = await Promise.all(promiseList);
    await deleteImages(awsKeysToDelete);

    results.forEach((result) => {
      delete result.dataValues.user;
    });

    res.status(200).json(results);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

// Delete all images
router.delete('/all', auth, async (req, res) => {
  try {
    const { uuid: userUUID } = req.user;

    const user = await User.findOne({
      where: { uuid: userUUID },
      include: 'images',
    });
    const images = user.images;

    const promiseList = [];
    const awsKeysToDelete = [];
    images.forEach((image) => {
      promiseList.push(image.destroy());
      awsKeysToDelete.push(image.awsKey);
    });
    const results = await Promise.all(promiseList);
    await deleteImages(awsKeysToDelete);

    results.forEach((result) => {
      delete result.dataValues.user;
    });

    res.status(200).json(results);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

module.exports = router;

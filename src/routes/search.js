const express = require('express');
const router = express.Router();
const { Label } = require('../models');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../models/index');
const { getCloudFrontUrl } = require('../S3/s3');

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
      beautifiedImage.url = getCloudFrontUrl(beautifiedImage.awsKey);

      beautifiedImage.user = {};
      beautifiedImage.user.uuid = image['user.uuid'];
      beautifiedImage.user.name = image['user.name'];

      beautifiedImages.push(beautifiedImage);
    });

    return res.json(beautifiedImages);
  } catch (error) {
    return defaultExpressErrorHandler(res, error);
  }
});

module.exports = router;

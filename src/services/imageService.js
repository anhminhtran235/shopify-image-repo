const { QueryTypes } = require('sequelize');
const CustomError = require('../errors/CustomError');

const imageRepo = require('../repositories/imageRepo');
const userRepo = require('../repositories/userRepo');
const labelRepo = require('../repositories/labelRepo');
const commonRepo = require('../repositories/commonRepo');
const labelService = require('../services/labelService');
const s3Service = require('../S3/s3Service');
const amazonRecoknitionService = require('../AmazonRecoknition/amazonRecoknitionService');

const uploadImage = async (
  imageBase64,
  filename,
  tempUUID,
  runAWSRecoknition,
  userUUID
) => {
  const user = await userRepo.findOne({ where: { uuid: userUUID } });
  if (!user) {
    throw new CustomError([{ msg: 'Your account does not exist' }], 400);
  }

  const uploadResult = await s3Service.uploadBase64Image(imageBase64);

  const image = await imageRepo.createOne({
    filename,
    awsKey: uploadResult.Key,
    userId: user.id,
  });

  if (runAWSRecoknition) {
    amazonRecoknitionService
      .detectLabels(uploadResult.Key)
      .then(async (result) => {
        const labelNames = result.Labels.map((label) => label.Name);
        const existingLabels = await labelRepo.findAll({
          where: { name: labelNames },
        });
        const existingLabelNames = existingLabels.map((label) => label.name);
        const newLabelNames = labelNames.filter(
          (labelName) => !existingLabelNames.includes(labelName)
        );
        const newLabels = await labelRepo.bulkCreate(
          newLabelNames.map((labelName) => ({ name: labelName }))
        );

        const allLabels = [...existingLabels, newLabels];
        for (let i = 0; i < allLabels.length; i++) {
          await image.addLabel(allLabels[i]);
        }
      });
  }

  const cloudFrontUrl = s3Service.getCloudFrontUrl(image.awsKey);

  return { url: cloudFrontUrl, tempUUID, ...image.toJSON() };
};

const deleteImages = async (imageUUIDs, userUUID) => {
  const images = await imageRepo.findAll({
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
  await s3Service.deleteImages(awsKeysToDelete);
  await labelService.deleteInfantLabels();

  results.forEach((result) => {
    delete result.dataValues.user;
  });

  return results;
};

const deleteAllImagesOfUser = async (userUUID) => {
  const user = await userRepo.findOne({
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
  await s3Service.deleteImages(awsKeysToDelete);

  await labelService.deleteInfantLabels();

  results.forEach((result) => {
    delete result.dataValues.user;
  });

  return results;
};

const getImagesFromSearchQueries = async (offset, limit, searchText, label) => {
  if (!offset) {
    offset = 0;
  }
  if (!limit) {
    limit = 10000000000000;
  }

  // I use '?' to prevent SQL injection
  const params = [];
  let queryString = `SELECT DISTINCT \`Image\`.\`uuid\` AS uuid,
    \`Image\`.\`filename\` AS filename,
    \`Image\`.\`awskey\` AS awsKey,
    \`Image\`.\`createdat\` AS createdAt,
    \`Image\`.\`updatedat\` AS updatedAt,
    \`user\`.\`uuid\` AS \`user.uuid\`,
    \`user\`.\`name\` AS \`user.name\`,
    \`user\`.\`createdat\` AS \`user.createdAt\`,
    \`user\`.\`updatedat\` AS \`user.updatedAt\`
      FROM   \`images\` AS \`Image\`
      LEFT OUTER JOIN \`users\` AS \`user\`
                  ON \`Image\`.\`userid\` = \`user\`.\`id\`
      INNER JOIN ( \`image_label\` INNER JOIN \`labels\`
                          ON \`labels\`.\`id\` = \`image_label\`.\`labelid\`)
              ON \`Image\`.\`id\` = \`image_label\`.\`imageid\``;

  if (searchText) {
    queryString += ` WHERE  ( \`user\`.\`name\` LIKE ?
      OR \`Image\`.\`filename\` LIKE ? )`;
    params.push(`%${searchText}%`, `%${searchText}%`);
  }
  if (label) {
    queryString += `AND \`labels\`.\`name\` = ?`;
    params.push(label);
  }

  queryString += ` ORDER  BY \`Image\`.\`createdat\` DESC
    LIMIT ? OFFSET ?`;
  params.push(+limit, +offset);

  const images = await commonRepo.executeQuery(queryString, {
    type: QueryTypes.SELECT,
    replacements: params,
  });

  const beautifiedImages = [];
  images.forEach((image) => {
    const beautifiedImage = {};
    beautifiedImage.uuid = image.uuid;
    beautifiedImage.filename = image.filename;
    beautifiedImage.awsKey = image.awsKey;
    beautifiedImage.url = s3Service.getCloudFrontUrl(beautifiedImage.awsKey);

    beautifiedImage.user = {};
    beautifiedImage.user.uuid = image['user.uuid'];
    beautifiedImage.user.name = image['user.name'];

    beautifiedImages.push(beautifiedImage);
  });

  return beautifiedImages;
};

module.exports = {
  uploadImage,
  getImagesFromSearchQueries,
  deleteImages,
  deleteAllImagesOfUser,
};

const config = require('config');
const S3 = require('aws-sdk/clients/s3');
const { v4: uuidv4 } = require('uuid');

const bucketName = config.get('S3_BUCKET_NAME');
const region = config.get('S3_BUCKET_REGION');
const accessKeyId = config.get('S3_ACCESS_KEY');
const secretAccessKey = config.get('S3_SECRET_KEY');

const cloudFrontUrl = config.get('CLOUD_FRONT_URL');

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const uploadBase64Image = (base64Image) => {
  const type = base64Image.split(';')[0].split('/')[1];
  const base64Data = new Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );
  const filename = uuidv4();

  const uploadParams = {
    Bucket: bucketName,
    Body: base64Data,
    Key: filename,
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,
  };

  return s3.upload(uploadParams).promise();
};

const deleteImages = (awsKeys) => {
  if (awsKeys.length === 0) {
    return;
  }

  const objects = awsKeys.map((awsKey) => ({
    Key: awsKey,
  }));

  const deleteParams = {
    Bucket: bucketName,
    Delete: {
      Objects: objects,
    },
  };

  return s3.deleteObjects(deleteParams).promise();
};

const getCloudFrontUrl = (awsKey) => {
  return `https://${cloudFrontUrl}/${awsKey}`;
};

module.exports = {
  uploadBase64Image,
  deleteImages,
  getCloudFrontUrl,
};

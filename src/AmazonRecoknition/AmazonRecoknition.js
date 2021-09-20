const AWS = require('aws-sdk');
const config = require('config');

const bucketName = config.get('S3_BUCKET_NAME');
const region = config.get('S3_BUCKET_REGION');
const accessKeyId = config.get('S3_ACCESS_KEY');
const secretAccessKey = config.get('S3_SECRET_KEY');

AWS.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

const rekognition = new AWS.Rekognition();

const detectLabels = (awsKey) => {
  const params = {
    Image: {
      S3Object: {
        Bucket: bucketName,
        Name: awsKey,
      },
    },
    MaxLabels: 3,
    MinConfidence: 98,
  };

  return rekognition.detectLabels(params).promise();
};

module.exports = { detectLabels };

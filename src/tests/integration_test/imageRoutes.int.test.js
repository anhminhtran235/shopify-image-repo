const config = require('config');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const httpRequest = require('request');
const fs = require('fs');
const path = require('path');

const { User, Image, Label, sequelize } = require('../../models');
const app = require('../../app');

const userData = {
  name: 'Test user',
  password: 'abcdxyz',
};

const userData2 = {
  name: 'Test user 2',
  password: '123456',
};

const imageData = {
  awsKey: 'aws123',
  filename: 'abc.png',
};

const imageData2 = {
  awsKey: 'abc-123',
  filename: 'def.jpg',
};

const pngBase64Image =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';
const jpgBase64Image =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/CABEIAAEAAQMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAK/9oACAEBAAAAAH8f/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAB//8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAxAAAAB//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPwB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwB//9k=';

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  const user = await User.create(userData);
  userData.uuid = user.uuid;
  const user2 = await User.create(userData2);
  userData2.uuid = user2.uuid;
  const label = await Label.create({ name: 'label1' });
  const label2 = await Label.create({ name: 'label2' });
  const image = await Image.create({ userId: user.id, ...imageData });
  await image.addLabel(label);
  const image2 = await Image.create({ userId: user2.id, ...imageData2 });
  await image2.addLabel(label2);
});

afterEach(async () => {
  await User.destroy({ where: {}, truncate: { cascade: true } });
  await Image.destroy({ where: {}, truncate: { cascade: true } });
  await Label.destroy({ where: {}, truncate: { cascade: true } });
});

const registerDummyUser = async ({ name, password }) => {
  return await request(app).post('/users/register').send({
    name,
    password,
  });
};

const uploadImage = async (
  imageBase64,
  filename,
  token,
  tempUUID,
  runAWSRecoknition = false
) => {
  const uploadResponse = await request(app)
    .post('/images/upload')
    .set('x-auth-token', token)
    .send({
      imageBase64,
      filename,
      tempUUID,
      runAWSRecoknition,
    });
  return uploadResponse.body;
};

const imageExists = (imageUrl) => {
  return new Promise((resolve, reject) => {
    httpRequest(imageUrl, function (err, resp) {
      if (err) {
        resolve(false);
      }
      if (resp.statusCode === 200) {
        resolve(true);
      }
      resolve(false);
    });
  });
};

describe('Test upload an image', () => {
  it('Upload png image successfully', async () => {
    const dummyUser = {
      name: 'abcd',
      password: 'xyz123456',
    };
    const registerResponse = await registerDummyUser(dummyUser);
    const token = registerResponse.body.token;
    const { url, filename, tempUUID } = await uploadImage(
      pngBase64Image,
      'image.png',
      token,
      'My-UUID'
    );

    expect(await imageExists(url)).toBe(true);
    expect(filename).toBe('image.png');
    expect(tempUUID).toBe('My-UUID');
  });

  it('Upload jpg image successfully', async () => {
    const dummyUser = {
      name: 'abcd',
      password: 'xyz123456',
    };
    const registerResponse = await registerDummyUser(dummyUser);
    const token = registerResponse.body.token;
    const { url, filename, tempUUID } = await uploadImage(
      jpgBase64Image,
      'image.jpg',
      token,
      'My-UUID'
    );

    expect(await imageExists(url)).toBe(true);
    expect(filename).toBe('image.jpg');
    expect(tempUUID).toBe('My-UUID');
  });

  it('Upload image without required request body', async () => {
    const dummyUser = {
      name: 'abcd',
      password: 'xyz123456',
    };
    const registerResponse = await registerDummyUser(dummyUser);
    const token = registerResponse.body.token;
    const response = await uploadImage(null, null, token, null);
    errorMessages = response.errors.map((err) => err.msg);
    const expectedErrorMessages = [
      'Image is required',
      'Filename is required',
      'TempUUID is required',
    ];
    expect(errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });

  it('Upload image with AWSRecoknition option on', async () => {
    jest.setTimeout(15000);
    const dummyUser = {
      name: 'abcd',
      password: 'xyz123456',
    };
    const registerResponse = await registerDummyUser(dummyUser);
    const token = registerResponse.body.token;

    const base64Image = fs.readFileSync(
      path.resolve(__dirname, '../resources/testImage.jfif'),
      {
        encoding: 'base64',
      }
    );

    const { url, filename, tempUUID, uuid } = await uploadImage(
      base64Image,
      'image.jpg',
      token,
      'My-UUID',
      true
    );

    const waitForAWSRecoknitionToProcess = () => {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const uploadedImage = await Image.findOne({
              where: { uuid },
              include: ['labels'],
            });
            resolve(uploadedImage);
          } catch (error) {
            reject(error);
          }
        }, 2000);
      });
    };

    const uploadedImage = await waitForAWSRecoknitionToProcess();

    expect(await imageExists(url)).toBe(true);
    expect(filename).toBe('image.jpg');
    expect(tempUUID).toBe('My-UUID');
    expect(uploadedImage.labels.length).toBeGreaterThan(0);
  });
});

describe('Test delete multiple images', () => {
  jest.setTimeout(100000);

  it('Delete multiple images successfully', async () => {
    const dummyUser = {
      name: 'abcd',
      password: 'xyz123456',
    };
    const registerResponse = await registerDummyUser(dummyUser);
    const token = registerResponse.body.token;

    const images = [];
    for (let i = 0; i < 5; i++) {
      const { url, uuid } = await uploadImage(
        jpgBase64Image,
        'image.jpg',
        token,
        'UUID'
      );
      if (i < 3) {
        images.push({ url, uuid });
      }
    }

    const deleteResponse = await request(app)
      .delete('/images')
      .set('x-auth-token', token)
      .send({
        imageUUIDs: images.map((image) => image.uuid),
      })
      .expect(200);

    const deletedImages = deleteResponse.body;
    expect(deletedImages.length).toBe(3);
    expect(deletedImages[0].uuid).not.toBeNull();
  });

  it('Delete all images successfully', async () => {
    const dummyUser = {
      name: 'abcd',
      password: 'xyz123456',
    };
    const registerResponse = await registerDummyUser(dummyUser);
    const token = registerResponse.body.token;

    const images = [];
    for (let i = 0; i < 3; i++) {
      const { url, uuid } = await uploadImage(
        jpgBase64Image,
        'image.jpg',
        token,
        'UUID'
      );
      images.push({ url, uuid });
    }

    const deleteResponse = await request(app)
      .delete('/images/all')
      .set('x-auth-token', token)
      .send()
      .expect(200);

    const deletedImages = deleteResponse.body;
    expect(deletedImages.length).toBe(3);
    expect(deletedImages[0].uuid).not.toBeNull();
  });
});

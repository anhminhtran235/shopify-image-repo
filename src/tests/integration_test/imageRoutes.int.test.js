const request = require('supertest');
const httpRequest = require('request');

const { User, Image, sequelize } = require('../../models');
const app = require('../../app');

const userData = {
  name: 'Test user',
  password: 'abcdxyz',
};

const imageData = {
  awsKey: 'aws123',
  filename: 'image.png',
};

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  const user = await User.create(userData);

  await Image.create({ userId: user.id, ...imageData });
});

afterEach(() => {
  User.destroy({ where: {}, truncate: true });
  Image.destroy({ where: {}, truncate: true });
});

const registerDummyUser = async ({ name, password }) => {
  return await request(app).post('/users/register').send({
    name,
    password,
  });
};

describe('Test get all images', () => {
  it('Get all images successfully', async () => {
    const response = await request(app).get('/images').expect(200);
    const images = response.body;
    const image = images[0];
    expect(images.length).toBe(1);
    expect(image.filename).toBe(imageData.filename);
    expect(image.awsKey).toBe(imageData.awsKey);
    expect(image.user.name).toBe(userData.name);
  });
});

describe('Test upload an image', () => {
  const pngBase64Image =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';
  const jpgBase64Image =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/CABEIAAEAAQMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAK/9oACAEBAAAAAH8f/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAB//8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAxAAAAB//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPwB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwB//9k=';

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

  it('Upload png image successfully', async () => {
    const dummyUser = {
      name: 'abcd',
      password: 'xyz123456',
    };
    const registerResponse = await registerDummyUser(dummyUser);
    const token = registerResponse.body.token;

    const uploadResponse = await request(app)
      .post('/images/upload')
      .set('x-auth-token', token)
      .send({
        imageBase64: pngBase64Image,
        filename: 'image.png',
      })
      .expect(200);
    const { url, filename } = uploadResponse.body;

    expect(await imageExists(url)).toBe(true);
    expect(filename).toBe('image.png');
  });

  it('Upload jpg image successfully', async () => {
    const dummyUser = {
      name: 'abcd',
      password: 'xyz123456',
    };
    const registerResponse = await registerDummyUser(dummyUser);
    const token = registerResponse.body.token;

    const uploadResponse = await request(app)
      .post('/images/upload')
      .set('x-auth-token', token)
      .send({
        imageBase64: jpgBase64Image,
        filename: 'image.jpg',
      })
      .expect(200);
    const { url, filename } = uploadResponse.body;

    expect(await imageExists(url)).toBe(true);
    expect(filename).toBe('image.jpg');
  });
});

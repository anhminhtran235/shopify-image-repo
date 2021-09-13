const request = require('supertest');
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

describe('Should get all images', () => {
  it('Get all images successfully', async () => {
    const response = await request(app).get('/images').expect(200);
    const images = response.body;
    const image = images[0];

    expect(images.length).toBe(1);
    expect(image.filename).toBe(imageData.filename);
    expect(image.awsKey).toBe(imageData.awsKey);
    expect(image.user.name).toBe(userData.name);
    expect(image.user.password).toBe(userData.password);
  });
});

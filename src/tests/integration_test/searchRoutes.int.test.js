const request = require('supertest');

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

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  const user = await User.create(userData);
  const user2 = await User.create(userData2);
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

describe('Test search images', () => {
  it('Search for all images successfully', async () => {
    const response = await request(app).get('/search').expect(200);
    const images = response.body;
    const image = images[0];
    expect(images.length).toBe(2);
    expect(image.uuid).not.toBeNull();
    expect(image.filename).toBe(imageData.filename);
    expect(image.awsKey).toBe(imageData.awsKey);
    expect(image.url).not.toBeNull();
    expect(image.user.name).toBe(userData.name);
    expect(image.user.uuid).not.toBeNull();
  });

  it('Search for images with limit and offset', async () => {
    const response = await request(app)
      .get('/search?limit=1&offset=1')
      .expect(200);
    const images = response.body;
    const image = images[0];
    expect(images.length).toBe(1);
    expect(image.filename).toBe(imageData2.filename);
    expect(image.awsKey).toBe(imageData2.awsKey);
    expect(image.user.name).toBe(userData2.name);
  });

  it('Search for images with search query', async () => {
    const response = await request(app)
      .get('/search?searchText=' + imageData2.filename.substring(1, 4))
      .expect(200);
    const images = response.body;
    const image = images[0];
    expect(images.length).toBe(1);
    expect(image.filename).toBe(imageData2.filename);
    expect(image.awsKey).toBe(imageData2.awsKey);
    expect(image.user.name).toBe(userData2.name);
  });

  it('Search for images with label query', async () => {
    const response = await request(app).get('/search?label=label1').expect(200);
    const images = response.body;
    const image = images[0];
    expect(images.length).toBe(1);
    expect(image.filename).toBe(imageData.filename);
    expect(image.awsKey).toBe(imageData.awsKey);
    expect(image.user.name).toBe(userData.name);
  });
});

describe('Test get available labels', () => {
  it('Get all available labels', async () => {
    const response = await request(app).get('/search/labels?name=').expect(200);
    const labels = response.body;
    expect(labels.length).toBe(2);
    expect(labels.includes('label1')).toBe(true);
    expect(labels.includes('label2')).toBe(true);
  });

  it('Query available labels', async () => {
    const response = await request(app)
      .get('/search/labels?name=label1')
      .expect(200);
    const labels = response.body;
    expect(labels.length).toBe(1);
    expect(labels.includes('label1')).toBe(true);
  });
});

const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');

const { User, Image, sequelize } = require('../../models');
const app = require('../../app');

const userData = [
  { name: 'Test user 1', password: 'abcdxyz' },
  { name: 'Test user 2', password: 'abcdxyz' },
];

let users = [];

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  users.push(await User.create(userData[0]));
  users.push(await User.create(userData[1]));
});

afterEach(() => {
  User.destroy({ where: {}, truncate: true });
});

const registerDummyUser = async ({ name, password }) => {
  return await request(app).post('/users/register').send({
    name,
    password,
  });
};

describe('Test get all users', () => {
  it('Get all users successfully', async () => {
    const response = await request(app).get('/users').expect(200);
    const users = response.body;
    const firstUser = users[0];

    expect(users.length).toBe(2);
    expect(firstUser.uuid).not.toBeNull();
    expect(userData.map((u) => u.name)).toContain(firstUser.name);
    expect(firstUser.createdAt).not.toBeNull();
  });
});

describe('Test register new user', () => {
  it('Register new user successfully', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        name: 'A new user',
        password: '123456',
      })
      .expect(200);
    const user = response.body.user;
    const token = response.body.token;

    expect(user.uuid).not.toBeNull();
    expect(user.name).toBe('A new user');
    expect(token).not.toBeNull();
  });

  it('Get a valid token back after registering', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        name: 'A new user',
        password: '123456',
      })
      .expect(200);
    const token = response.body.token;

    expect(token).not.toBeNull();
    expect(() => jwt.verify(token, config.get('jsonSecret'))).not.toThrow();
  });

  it('Token should include the correct user uuid', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        name: 'A new user',
        password: '123456',
      })
      .expect(200);
    const user = response.body.user;
    const token = response.body.token;
    const decodedToken = jwt.decode(token, config.get('jsonSecret'));

    expect(decodedToken.user.uuid).toBe(user.uuid);
  });

  it('Should fail if username or password is invalid', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        name: '',
        password: '21',
      })
      .expect(400);
    const errors = response.body.errors;
    const errorMessages = errors.map((err) => err.msg);

    const expectedErrorMessages = [
      'User name is required',
      'Password must have 6 or more characters',
    ];
    expect(errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });
});

describe('Test login', () => {
  it('Login successfully', async () => {
    const dummyUser = {
      name: 'abcd',
      password: 'xyz123456',
    };

    await registerDummyUser(dummyUser);
    const response = await request(app).post('/users/login').send(dummyUser);
    const user = response.body.user;
    const token = response.body.token;

    expect(user.uuid).not.toBeNull();
    expect(user.name).toBe(dummyUser.name);
    expect(token).not.toBeNull();
  });

  it('Login fail if empty username or password', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        name: '',
        password: '',
      })
      .expect(400);
    const errors = response.body.errors;
    const errorMessages = errors.map((err) => err.msg);

    const expectedErrorMessages = [
      'User name is required',
      'Password is required',
    ];
    expect(errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });
});

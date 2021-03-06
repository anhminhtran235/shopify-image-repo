const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');

const { User, Image, Label, sequelize } = require('../../models');
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

describe('Test get current user', () => {
  it('Get current user successfully', async () => {
    let response = await request(app)
      .post('/users/register')
      .send({
        name: 'A new user',
        password: '123456',
      })
      .expect(200);
    const token = response.body.token;

    response = await request(app)
      .get('/users/me')
      .set('x-auth-token', token)
      .expect(200);
    const currentUser = response.body;

    expect(currentUser.uuid).not.toBeNull();
    expect(currentUser.name).toContain('A new user');
  });

  it('Get current with no token, should fail', async () => {
    response = await request(app).get('/users/me').expect(401);
  });

  it('Get current with invalid token, should fail', async () => {
    response = await request(app)
      .get('/users/me')
      .set('x-auth-token', 'INVALID_TOKEN')
      .expect(401);
  });
});

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
    expect(() => jwt.verify(token, config.get('JWT_SECRET'))).not.toThrow();
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
    const decodedToken = jwt.decode(token, config.get('JWT_SECRET'));

    expect(decodedToken.user.uuid).toBe(user.uuid);
  });

  it('Should fail to register if username or password is invalid', async () => {
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

  it('Should fail to register if username already exists', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        name: userData[0].name,
        password: '123456',
      })
      .expect(400);

    const errors = response.body.errors;
    const errorMessages = errors.map((err) => err.msg);

    const expectedErrorMessages = [
      `User with name ${userData[0].name} already exists`,
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

  it('Login fail if wrong username', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        name: 'user_name_not_exists',
        password: 'password',
      })
      .expect(401);
    const errors = response.body.errors;
    const errorMessages = errors.map((err) => err.msg);

    const expectedErrorMessages = ['Invalid credentials'];
    expect(errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });

  it('Login fail if wrong password', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        name: userData[0].name,
        password: 'wrong_password',
      })
      .expect(401);
    const errors = response.body.errors;
    const errorMessages = errors.map((err) => err.msg);

    const expectedErrorMessages = ['Invalid credentials'];
    expect(errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });
});

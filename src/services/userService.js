const bcrypt = require('bcryptjs');

const userRepo = require('../repositories/userRepo');
const { generateToken } = require('./jwtService');
const CustomError = require('../errors/CustomError');

const getMyInfo = (uuid) => {
  return userRepo.findOne({ where: { uuid } });
};

const getAllUsers = () => {
  return userRepo.findAll({ include: 'images' });
};

const login = async (name, password) => {
  const user = await userRepo.findOne({ where: { name } });
  if (!user) {
    throw new CustomError([{ msg: 'Invalid credentials' }], 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new CustomError([{ msg: 'Invalid credentials' }], 401);
  }

  const payload = {
    user: {
      uuid: user.uuid,
    },
  };

  const token = await generateToken(payload);

  return { user, token };
};

const register = async (name, password) => {
  const usernameExists = !!(await userRepo.findOne({ where: { name } }));
  if (usernameExists) {
    throw new CustomError(
      [{ msg: `User with name ${name} already exists` }],
      400
    );
  }

  let user = {
    name,
  };
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user = await userRepo.createOne(user);

  const payload = {
    user: {
      uuid: user.uuid,
    },
  };

  const token = await generateToken(payload);

  return { user, token };
};

module.exports = {
  getMyInfo,
  getAllUsers,
  login,
  register,
};

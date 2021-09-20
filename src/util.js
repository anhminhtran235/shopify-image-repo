const { validationResult } = require('express-validator');

const CustomError = require('./errors/CustomError');

const shallowCloneRemoveFields = (obj, ...fieldNames) => {
  const shallowClone = { ...obj };
  for (let i = 0; i < fieldNames.length; i++) {
    delete shallowClone[fieldNames[i]];
  }
  return shallowClone;
};

const defaultExpressErrorHandler = (res, error) => {
  console.log(error);
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ errors: error.messages });
  } else {
    return res.status(500).json({ errors: [{ msg: 'Something went wrong' }] });
  }
};

const defaultRequestValidator = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError(errors.array(), 400);
  }
};

module.exports = {
  shallowCloneRemoveFields,
  defaultExpressErrorHandler,
  defaultRequestValidator,
};

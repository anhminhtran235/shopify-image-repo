const shallowCloneRemoveFields = (obj, ...fieldNames) => {
  const shallowClone = { ...obj };
  for (let i = 0; i < fieldNames.length; i++) {
    delete shallowClone[fieldNames[i]];
  }
  return shallowClone;
};

const defaultExpressErrorHandler = (res, error) => {
  console.error(error);
  return res.status(500).json({ errors: [{ msg: 'Something went wrong' }] });
};

module.exports = {
  shallowCloneRemoveFields,
  defaultExpressErrorHandler,
};

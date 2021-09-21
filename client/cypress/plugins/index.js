/// <reference types="cypress" />

module.exports = (on, config) => {
  on('task', {
    'db:teardown': () => {
      const teardown = require('../../../src/db/teardown');
      return teardown();
    },
  });
};

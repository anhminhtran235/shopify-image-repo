const { shallowCloneRemoveFields } = require('../../util');

describe('Test shallowCloneRemoveFields', () => {
  const name = 'Test user';
  const password = 'hash abc xyz';
  const getUser = () => {
    return {
      id: 1,
      name,
      password,
    };
  };

  it('Should remove the specified field', () => {
    const user = getUser();
    const clonedUser = shallowCloneRemoveFields(user, 'id');

    expect(clonedUser.id).toBe(undefined);
    expect(clonedUser.name).toBe(name);
    expect(clonedUser.password).toBe(password);
    expect(Object.keys(clonedUser).length).toBe(2);
  });

  it('Should remove multiple specified fields', () => {
    const user = getUser();
    const clonedUser = shallowCloneRemoveFields(user, 'id', 'name');

    expect(clonedUser.id).toBe(undefined);
    expect(clonedUser.name).toBe(undefined);
    expect(clonedUser.password).toBe(password);
    expect(Object.keys(clonedUser).length).toBe(1);
  });
});

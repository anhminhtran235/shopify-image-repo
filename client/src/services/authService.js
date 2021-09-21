import axios from 'axios';

export const login = (name, password) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, password });
  return axios.post('users/login', body, config);
};

export const register = (name, password) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, password });
  return axios.post('users/register', body, config);
};

export const getMe = () => {
  const config = {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  };

  return axios.get('users/me', config);
};

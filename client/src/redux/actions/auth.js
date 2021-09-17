import axios from 'axios';
import alertify from 'alertifyjs';

import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_ME_SUCCESS,
  GET_ME_FAILURE,
} from '../actions/types';

export const register =
  ({ name, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, password });

    try {
      const res = await axios.post('users/register', body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      alertify.error(error);

      dispatch({
        type: REGISTER_FAILURE,
      });
    }
  };

export const login =
  ({ name, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, password });

    try {
      const res = await axios.post('users/login', body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      alertify.error(error);

      dispatch({
        type: LOGIN_FAILURE,
      });
    }
  };

export const getMe = () => async (dispatch) => {
  const config = {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  };

  try {
    const res = await axios.get('users/me', config);

    dispatch({
      type: GET_ME_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    alertify.error(error);

    dispatch({
      type: GET_ME_FAILURE,
    });
  }
};

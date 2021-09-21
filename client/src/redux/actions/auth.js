import alertify from 'alertifyjs';

import * as authService from '../../services/authService';

import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_ME_SUCCESS,
  GET_ME_FAILURE,
  LOGOUT,
  REGISTER_IN_PROGRESS,
  LOGIN_IN_PROGRESS,
} from '../actions/types';
import { handleErrors } from '../../util/ErrorHandler';

export const login =
  ({ name, password }) =>
  async (dispatch) => {
    try {
      dispatch({ type: LOGIN_IN_PROGRESS });
      const res = await authService.login(name, password);
      alertify.success('Login successfully');

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      handleErrors(error);
      dispatch({
        type: LOGIN_FAILURE,
      });
    }
  };

export const register =
  ({ name, password }) =>
  async (dispatch) => {
    try {
      dispatch({ type: REGISTER_IN_PROGRESS });
      const res = await authService.register(name, password);
      alertify.success('Register successfully');

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      handleErrors(error);

      dispatch({
        type: REGISTER_FAILURE,
      });
    }
  };

export const getMe = () => async (dispatch) => {
  try {
    const res = await authService.getMe();

    dispatch({
      type: GET_ME_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ME_FAILURE,
    });
  }
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

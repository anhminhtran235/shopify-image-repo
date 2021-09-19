import axios from 'axios';
import {
  DELETE_IMAGES_SUCCESS,
  FETCH_IMAGES_FAILURE,
  FETCH_IMAGES_SUCCESS,
  SET_SELECT_IMAGE,
  SET_SHOW_LOADER,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGE_FAILURE,
  UPLOAD_IMAGE_SUCCESS,
} from './types';

import { handleErrors } from '../../util/ErrorHandler';
import alertify from 'alertifyjs';

export const fetchImages = (offset, limit) => async (dispatch) => {
  try {
    const res = await axios.get(`images?offset=${offset}&limit=${limit}`);

    dispatch({
      type: FETCH_IMAGES_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
    handleErrors(error);
    dispatch({
      type: FETCH_IMAGES_FAILURE,
    });
  }
};

export const requestUploadImages = (images) => (dispatch) => {
  dispatch({ type: UPLOAD_IMAGES_REQUEST, payload: images });
};

export const uploadImage =
  (imageBase64, filename, tempUUID) => async (dispatch, getState) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
    };

    const body = JSON.stringify({ imageBase64, filename, tempUUID });

    try {
      const res = await axios.post('images/upload', body, config);
      res.data.user = getState().auth.user;

      dispatch({
        type: UPLOAD_IMAGE_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      handleErrors(error);

      dispatch({
        type: UPLOAD_IMAGE_FAILURE,
        payload: error.response.data,
      });
    }
  };

export const setSelectImage = (uuid, isSelected) => (dispatch) => {
  dispatch({
    type: SET_SELECT_IMAGE,
    payload: {
      uuid,
      isSelected,
    },
  });
};

export const deleteImages = (imageUUIDs) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token'),
    },
    data: JSON.stringify({ imageUUIDs }),
  };

  try {
    dispatch({ type: SET_SHOW_LOADER, payload: true });
    const res = await axios.delete('images', config);
    dispatch({ type: SET_SHOW_LOADER, payload: false });
    alertify.success('Successfully deleted ' + res.data.length + ' images ');
    dispatch({
      type: DELETE_IMAGES_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: SET_SHOW_LOADER, payload: false });
    handleErrors(error);
  }
};

export const deleteAllMyImages = (userUUID) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token'),
    },
    data: JSON.stringify({ userUUID }),
  };

  try {
    dispatch({ type: SET_SHOW_LOADER, payload: true });
    const res = await axios.delete('images/all', config);
    dispatch({ type: SET_SHOW_LOADER, payload: false });
    alertify.success('Successfully deleted ' + res.data.length + ' images ');
    dispatch({
      type: DELETE_IMAGES_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: SET_SHOW_LOADER, payload: false });
    handleErrors(error);
  }
};

import axios from 'axios';
import {
  FETCH_IMAGES_FAILURE,
  FETCH_IMAGES_SUCCESS,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGE_FAILURE,
  UPLOAD_IMAGE_SUCCESS,
} from './types';
import { handleErrors } from '../../util/ErrorHandler';

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
  (imageBase64, filename, tempUUID) => async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
    };

    const body = JSON.stringify({ imageBase64, filename, tempUUID });

    try {
      const res = await axios.post('images/upload', body, config);

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

import axios from 'axios';
import { FETCH_IMAGES_FAILURE, FETCH_IMAGES_SUCCESS } from './types';
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

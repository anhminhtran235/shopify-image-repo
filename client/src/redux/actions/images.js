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
import * as imageService from '../../services/imageService';

export const fetchImages =
  (offset, limit, searchText, label) => async (dispatch) => {
    try {
      const res = await imageService.fetchImages(
        offset,
        limit,
        searchText,
        label
      );

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
    try {
      const res = await imageService.uploadImage(
        imageBase64,
        filename,
        tempUUID
      );
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
  try {
    dispatch({ type: SET_SHOW_LOADER, payload: true });
    const res = await imageService.deleteImages(imageUUIDs);
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
  try {
    dispatch({ type: SET_SHOW_LOADER, payload: true });
    const res = await imageService.deleteAllImages(userUUID);
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

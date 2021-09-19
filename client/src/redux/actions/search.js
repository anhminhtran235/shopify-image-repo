import axios from 'axios';
import {
  CLEAR_IMAGES,
  GET_LABEL_SUCCESS,
  SET_SHOW_LOADER,
  SET_TEMP_LABEL,
  SET_TEMP_SEARCH_TEXT,
  SYNC_SEARCH_QUERY,
} from './types';
import { handleErrors } from '../../util/ErrorHandler';
import { fetchImages } from './images';

export const getLabels = (labelName) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.get('search/labels?name=' + labelName, config);
    dispatch({
      type: GET_LABEL_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    handleErrors(error);
  }
};

export const setTempLabel = (labelName) => (dispatch) => {
  dispatch({
    type: SET_TEMP_LABEL,
    payload: labelName,
  });
};

export const setTempSearchText = (searchText) => (dispatch) => {
  dispatch({
    type: SET_TEMP_SEARCH_TEXT,
    payload: searchText,
  });
};

export const executeNewSearch = () => async (dispatch, getState) => {
  dispatch({
    type: SYNC_SEARCH_QUERY,
  });

  dispatch({
    type: CLEAR_IMAGES,
  });

  dispatch({ type: SET_SHOW_LOADER, payload: true });
  await fetchImages(
    0,
    10,
    getState().search.currentSearchText,
    getState().search.currentLabel
  )(dispatch);
  dispatch({ type: SET_SHOW_LOADER, payload: false });
};

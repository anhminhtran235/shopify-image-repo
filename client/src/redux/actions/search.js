import axios from 'axios';
import {
  GET_LABEL_SUCCESS,
  SET_CURRENT_LABEL,
  SET_CURRENT_SEARCH_TEXT,
} from './types';
import { handleErrors } from '../../util/ErrorHandler';

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

export const setCurrentLabel = (labelName) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_LABEL,
    payload: labelName,
  });
};

export const setCurrentSearchText = (searchText) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_SEARCH_TEXT,
    payload: searchText,
  });
};

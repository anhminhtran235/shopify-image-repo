import {
  GET_LABEL_SUCCESS,
  SET_CURRENT_LABEL,
  SET_CURRENT_SEARCH_TEXT,
} from '../actions/types';

const initialState = {
  searchLabels: [],
  currentLabel: '',
  currentSearchText: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_LABEL_SUCCESS:
      return {
        ...state,
        searchLabels: payload,
      };

    case SET_CURRENT_LABEL:
      return {
        ...state,
        currentLabel: payload,
      };

    case SET_CURRENT_SEARCH_TEXT:
      return {
        ...state,
        currentSearchText: payload,
      };

    default:
      return state;
  }
}

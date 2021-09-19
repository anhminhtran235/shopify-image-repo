import {
  GET_LABEL_SUCCESS,
  SET_TEMP_LABEL,
  SET_TEMP_SEARCH_TEXT,
  SYNC_SEARCH_QUERY,
} from '../actions/types';

const initialState = {
  searchLabels: [],
  tempLabel: '',
  tempSearchText: '',
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

    case SET_TEMP_LABEL:
      return {
        ...state,
        tempLabel: payload,
      };

    case SET_TEMP_SEARCH_TEXT:
      return {
        ...state,
        tempSearchText: payload,
      };

    case SYNC_SEARCH_QUERY:
      return {
        ...state,
        currentSearchText: state.tempSearchText,
        currentLabel: state.tempLabel,
      };

    default:
      return state;
  }
}

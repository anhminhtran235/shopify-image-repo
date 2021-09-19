import { GET_LABEL_SUCCESS, SET_CURRENT_LABEL } from '../actions/types';

const initialState = {
  searchLabels: [],
  currentLabel: '',
  searchTexts: [],
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

    default:
      return state;
  }
}

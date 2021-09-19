import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_ME_SUCCESS,
  GET_ME_FAILURE,
  LOGOUT,
  LOGIN_IN_PROGRESS,
  REGISTER_IN_PROGRESS,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  user: null,
  loading: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        user: payload.user,
        isAuthenticated: true,
        loading: false,
      };

    case GET_ME_SUCCESS:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_ME_FAILURE:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };

    case LOGIN_IN_PROGRESS:
    case REGISTER_IN_PROGRESS:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}

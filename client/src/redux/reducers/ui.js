import {
  SET_SHOW_LOADER,
  UPLOADING_PROGRESS_CLOSE,
  UPLOADING_PROGRESS_OPEN,
} from '../actions/types';

const initialState = {
  isUploadingProgressOpened: false,
  showLoader: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPLOADING_PROGRESS_OPEN:
      return {
        ...state,
        isUploadingProgressOpened: true,
      };

    case UPLOADING_PROGRESS_CLOSE:
      return {
        ...state,
        isUploadingProgressOpened: false,
      };

    case SET_SHOW_LOADER:
      return {
        ...state,
        showLoader: payload,
      };

    default:
      return state;
  }
}

import {
  UPLOADING_PROGRESS_CLOSE,
  UPLOADING_PROGRESS_OPEN,
} from '../actions/types';

const initialState = {
  isUploadingProgressOpened: false,
};

export default function (state = initialState, action) {
  const { type } = action;

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

    default:
      return state;
  }
}

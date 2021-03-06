import {
  SET_SHOW_LOADER,
  UPLOADING_PROGRESS_CLOSE,
  UPLOADING_PROGRESS_OPEN,
} from './types';

export const openUploadingProgress = () => (dispatch) => {
  dispatch({ type: UPLOADING_PROGRESS_OPEN });
};

export const closeUploadingProgress = () => (dispatch) => {
  dispatch({ type: UPLOADING_PROGRESS_CLOSE });
};

export const setShowLoader = (showLoader) => (dispatch) => {
  dispatch({ type: SET_SHOW_LOADER, payload: showLoader });
};

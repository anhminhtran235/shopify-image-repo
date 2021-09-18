import { FETCH_IMAGES_FAILURE, FETCH_IMAGES_SUCCESS } from '../actions/types';

const initialState = {
  images: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_IMAGES_SUCCESS:
      const existingImageList = state.images;
      const newImageList = [...existingImageList];
      newImageList.push(...payload);
      return {
        images: newImageList,
      };
    case FETCH_IMAGES_FAILURE:
    default:
      return state;
  }
}

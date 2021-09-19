import {
  UPLOADING_DONE,
  UPLOADING_ERROR,
  UPLOADING_IN_PROGRESS,
} from '../../util/enum';
import {
  FETCH_IMAGES_FAILURE,
  FETCH_IMAGES_SUCCESS,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAILURE,
  SET_SELECT_IMAGE,
  DELETE_IMAGES_SUCCESS,
} from '../actions/types';

const initialState = {
  images: [],
  uploadingImages: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPLOAD_IMAGES_REQUEST:
      const images = payload.map((image) => ({ ...image }));
      images.forEach((image) => {
        image.status = UPLOADING_IN_PROGRESS;
      });
      const updatedUploadingImages = [...state.uploadingImages];
      updatedUploadingImages.unshift(...images);
      return {
        ...state,
        uploadingImages: updatedUploadingImages,
      };

    case UPLOAD_IMAGE_SUCCESS:
      const updatedImages = [...state.images];
      updatedImages.unshift(payload);

      const updatedUploading = state.uploadingImages.map((image) => ({
        ...image,
      }));
      updatedUploading.find(
        (image) => image.tempUUID === payload.tempUUID
      ).status = UPLOADING_DONE;
      return {
        ...state,
        uploadingImages: updatedUploading,
        images: updatedImages,
      };

    case UPLOAD_IMAGE_FAILURE:
      const updated = state.uploadingImages.map((image) => ({
        ...image,
      }));
      updated.find((image) => image.tempUUID === payload.tempUUID).status =
        UPLOADING_ERROR;

      return {
        ...state,
        uploadingImages: updated,
      };

    case FETCH_IMAGES_SUCCESS:
      const existingImageList = state.images;
      const newImageList = [...existingImageList];
      newImageList.push(...payload);

      return {
        ...state,
        images: newImageList,
      };

    case FETCH_IMAGES_FAILURE:
      return state;

    case SET_SELECT_IMAGE:
      const myImages = [...state.images];
      const image = myImages.find((image) => image.uuid === payload.uuid);
      image.isSelected = payload.isSelected;
      return {
        ...state,
        images: myImages,
      };

    case DELETE_IMAGES_SUCCESS:
      const deletedUUIDs = payload.map((image) => image.uuid);
      const imagesAfterDelete = state.images.filter(
        (image) => !deletedUUIDs.includes(image.uuid)
      );
      return {
        ...state,
        images: imagesAfterDelete,
      };
    default:
      return state;
  }
}

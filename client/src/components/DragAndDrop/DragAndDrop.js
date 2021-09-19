import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { toBase64 } from '../../util/util';
import { uploadImage, requestUploadImages } from '../../redux/actions/images';
import { openUploadingProgress } from '../../redux/actions/ui';
import { DragAndDropStyle } from '../styles/DragAndDropStyle';

const DragAndDrop = ({
  uploadImage,
  requestUploadImages,
  openUploadingProgress,
}) => {
  const onDrop = useCallback((acceptedImages) => {
    openUploadingProgress();

    acceptedImages.forEach((image) => {
      image.tempUUID = uuidv4();
    });

    requestUploadImages(
      acceptedImages.map((image) => ({
        filename: image.name,
        tempUUID: image.tempUUID,
      }))
    );

    acceptedImages.forEach(async (image) => {
      try {
        const imageBase64 = await toBase64(image);
        const filename = image.name;
        const tempUUID = image.tempUUID;
        uploadImage(imageBase64, filename, tempUUID);
      } catch (error) {}
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <DragAndDropStyle isDragActive={isDragActive} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drop some files here, or click to select files</p>
      )}
    </DragAndDropStyle>
  );
};

export default connect(null, {
  uploadImage,
  requestUploadImages,
  openUploadingProgress,
})(DragAndDrop);

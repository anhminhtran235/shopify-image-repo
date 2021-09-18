import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';

import { toBase64 } from '../../util/util';
import { uploadImage } from '../../redux/actions/images';

const DragAndDrop = ({ children, uploadImage }) => {
  const onDrop = useCallback((acceptedImages) => {
    console.log(acceptedImages);
    acceptedImages.forEach(async (image) => {
      try {
        const imageBase64 = await toBase64(image);
        const filename = image.name;
        uploadImage(imageBase64, filename);
      } catch (error) {}
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default connect(null, { uploadImage })(DragAndDrop);

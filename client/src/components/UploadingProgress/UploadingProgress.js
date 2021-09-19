import { connect } from 'react-redux';
import { UPLOADING_DONE } from '../../util/enum';
import { closeUploadingProgress } from '../../redux/actions/ui';

import {
  ImageProgressHeader,
  ImagesProgressStyle,
  UploadingProgressStyle,
} from '../styles/UploadingProgressStyle';
import ImageProgress from './ImageProgress';

const UploadingProgress = ({
  uploadingImages,
  isOpened,
  closeUploadingProgress,
}) => {
  const totalImages = uploadingImages.length;
  const imagesCompleted = uploadingImages.filter(
    (image) => image.status === UPLOADING_DONE
  )?.length;
  return isOpened ? (
    <UploadingProgressStyle>
      <ImageProgressHeader>
        <p>
          Completed uploading {imagesCompleted} / {totalImages} images
        </p>
        <div className='close-btn'>
          <i onClick={closeUploadingProgress} className='fas fa-times'></i>
        </div>
      </ImageProgressHeader>
      <ImagesProgressStyle>
        {uploadingImages.map((image) => (
          <ImageProgress
            key={image.tempUUID}
            filename={image.filename}
            status={image.status}
          />
        ))}
      </ImagesProgressStyle>
    </UploadingProgressStyle>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    uploadingImages: state.images.uploadingImages,
    isOpened: state.ui.isUploadingProgressOpened,
  };
};

export default connect(mapStateToProps, { closeUploadingProgress })(
  UploadingProgress
);

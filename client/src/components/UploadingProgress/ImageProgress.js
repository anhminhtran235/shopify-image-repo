import {
  UPLOADING_DONE,
  UPLOADING_ERROR,
  UPLOADING_IN_PROGRESS,
} from '../../util/enum';
import MiniSpinner from '../Loader/MiniSpinner';
import { ImageProgressStyle } from '../styles/UploadingProgressStyle';

const ImageProgress = ({ filename, status }) => {
  const isInProgress = status === UPLOADING_IN_PROGRESS;
  const isCompleted = status === UPLOADING_DONE;
  const hasError = status === UPLOADING_ERROR;

  const name = filename.substring(0, filename.lastIndexOf('.') + 1);
  const extension = filename.substring(
    filename.lastIndexOf('.') + 1,
    filename.length
  );

  return (
    <ImageProgressStyle>
      <div class='meta-data'>
        <div class='img-extension'>{extension}</div>
        <div class='img-name'>{name}</div>
      </div>
      <div class='status'>
        {isInProgress && <MiniSpinner />}
        {isCompleted && <i class='fas fa-check-square'></i>}
      </div>
    </ImageProgressStyle>
  );
};

export default ImageProgress;

import {
  UPLOADING_DONE,
  UPLOADING_ERROR,
  UPLOADING_IN_PROGRESS,
} from '../../util/enum';
import { shortenFileName } from '../../util/util';
import MiniSpinner from '../Loader/MiniSpinner';
import { ImageProgressStyle } from '../styles/UploadingProgressStyle';

const ImageProgress = ({ filename, status }) => {
  const isInProgress = status === UPLOADING_IN_PROGRESS;
  const isCompleted = status === UPLOADING_DONE;
  const hasError = status === UPLOADING_ERROR;

  const shortenedName = shortenFileName(filename);
  const extension = filename.substring(
    filename.lastIndexOf('.') + 1,
    filename.length
  );

  return (
    <ImageProgressStyle>
      <div className='meta-data'>
        <div className='img-extension'>{extension}</div>
        <div className='img-name'>{shortenedName}</div>
      </div>
      <div className='status'>
        {isInProgress && <MiniSpinner />}
        {isCompleted && <i className='fas fa-check-square'></i>}
      </div>
    </ImageProgressStyle>
  );
};

export default ImageProgress;

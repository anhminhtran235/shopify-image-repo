import {
  ImageProgressHeader,
  ImagesProgressStyle,
  UploadingProgressStyle,
} from '../styles/UploadingProgressStyle';
import ImageProgress from './ImageProgress';

const UploadingProgress = () => {
  const imagesInProgress = [1, 2, 3, 4, 5, 6];
  return (
    <UploadingProgressStyle>
      <ImageProgressHeader>
        <p>6 uploads complete</p>
        <p>X</p>
      </ImageProgressHeader>
      <ImagesProgressStyle>
        {imagesInProgress.map((image) => (
          <ImageProgress />
        ))}
      </ImagesProgressStyle>
    </UploadingProgressStyle>
  );
};

export default UploadingProgress;

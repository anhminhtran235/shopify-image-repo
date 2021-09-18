import MiniSpinner from '../Loader/MiniSpinner';
import { ImageProgressStyle } from '../styles/UploadingProgressStyle';

const ImageProgress = () => {
  const completed = Math.random() < 0.5;
  return (
    <ImageProgressStyle>
      <div class='meta-data'>
        <div class='img-extension'>jpeg</div>
        <div class='img-name'>1 image in progress</div>
      </div>
      <div class='status'>
        {completed ? <i class='fas fa-check-square'></i> : <MiniSpinner />}
      </div>
    </ImageProgressStyle>
  );
};

export default ImageProgress;

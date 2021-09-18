import { ImageStyle } from '../styles/ImageStyle';

const Image = ({ isMine, url, filename }) => {
  return (
    <ImageStyle>
      <div>
        <img src={url} alt={filename} />
      </div>
      <div>
        <p>{filename}</p>
        <a href={url}>Open</a>
        {isMine ? 'IsMine' : ''}
      </div>
    </ImageStyle>
  );
};

export default Image;

import { ImageStyle, Wrapper } from '../styles/ImageStyle';

const Image = ({ isMine, url, filename }) => {
  return (
    <Wrapper>
      <ImageStyle>
        <div class='image-outside-wrapper'>
          <div class='image-inside-wrapper'>
            <img src={url} alt={filename} />
          </div>
        </div>
        <div class='filename'>
          <p>{filename}</p>
        </div>
        <div class='username'>
          <p>Uploaded by USER_NAME</p>
        </div>
        {isMine && <input type='checkbox' />}
      </ImageStyle>
    </Wrapper>
  );
};

export default Image;

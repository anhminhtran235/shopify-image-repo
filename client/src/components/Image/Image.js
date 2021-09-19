import { connect } from 'react-redux';

import { ImageStyle, OutsideWrapper, Wrapper } from '../styles/ImageStyle';
import { setSelectImage } from '../../redux/actions/images';

const Image = ({ uuid, isMine, url, filename, setSelectImage }) => {
  const openImage = () => {
    window.open(url, '_blank').focus();
  };

  const handleClickCheckbox = (e) => {
    const isSelected = e.target.checked;
    setSelectImage(uuid, isSelected);
  };

  return (
    <OutsideWrapper>
      <Wrapper>
        <ImageStyle onClick={openImage}>
          <div className='image-outside-wrapper'>
            <div className='image-inside-wrapper'>
              <img src={url} alt={filename} />
            </div>
          </div>
          <div className='filename'>
            <p>{filename}</p>
          </div>
          <div className='username'>
            <p>Uploaded by USER_NAME</p>
          </div>
        </ImageStyle>
        {isMine && (
          <input
            type='checkbox'
            onClick={handleClickCheckbox}
            className='check-box'
          />
        )}
      </Wrapper>
    </OutsideWrapper>
  );
};

export default connect(null, { setSelectImage })(Image);

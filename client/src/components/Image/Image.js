import { connect } from 'react-redux';

import { ImageStyle, OutsideWrapper, Wrapper } from '../styles/ImageStyle';
import { setSelectImage } from '../../redux/actions/images';
import { shortenFileName } from '../../util/util';

const Image = ({ uuid, isMine, url, filename, ownerName, setSelectImage }) => {
  const openImage = () => {
    window.open(url, '_blank').focus();
  };

  const shortenedFileName = shortenFileName(filename);

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
            <p>{shortenedFileName}</p>
          </div>
          <div className='username'>
            <p>Uploaded by {ownerName}</p>
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

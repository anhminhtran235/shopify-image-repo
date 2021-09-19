import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from 'react';

import Image from '../Image/Image';
import { HomeStyle, ImagesStyle, MenuStyle } from '../styles/HomeStyle';
import DragAndDrop from '../DragAndDrop/DragAndDrop';
import FancySearchBox from '../Search/FancySearchBox';

import {
  fetchImages,
  deleteImages,
  deleteAllMyImages,
} from '../../redux/actions/images';
import { executeNewSearch } from '../../redux/actions/search';
import UploadingProgress from '../UploadingProgress/UploadingProgress';
import NormalSearchBox from '../Search/NormalSearchBox';

const Home = ({
  images,
  fetchImages,
  user,
  isAuthenticated,
  deleteImages,
  deleteAllMyImages,
  currentSearchText,
  currentLabel,
  executeNewSearch,
}) => {
  useEffect(() => {
    fetchMoreImages();
  }, []);

  const fetchMoreImages = () => {
    const offset = images.length;
    fetchImages(offset, 10, currentSearchText, currentLabel);
  };

  const onDeleteImages = () => {
    const selectedImageUUIDs = images
      .filter((image) => image.isSelected)
      .map((image) => image.uuid);

    deleteImages(selectedImageUUIDs);
  };

  const onDeleteAllImages = () => {
    const userUUID = user.uuid;
    deleteAllMyImages(userUUID);
  };

  const selectedImagesCount = images.filter((image) => image.isSelected).length;

  return (
    <HomeStyle>
      {isAuthenticated ? (
        <MenuStyle>
          <DragAndDrop />
          <div className='option'>
            <NormalSearchBox />
            <FancySearchBox />
            <div className='btn-group'>
              <button className='search-btn' onClick={executeNewSearch}>
                Search
              </button>
              <button className='btn' onClick={onDeleteAllImages}>
                Delete ALL of my images
              </button>
              {selectedImagesCount > 0 && (
                <button className='btn' onClick={onDeleteImages}>
                  Delete {selectedImagesCount} images
                </button>
              )}
            </div>
          </div>
        </MenuStyle>
      ) : (
        <h2>Please login to upload and manage images</h2>
      )}
      <ImagesStyle>
        <InfiniteScroll
          dataLength={images.length}
          next={fetchMoreImages}
          hasMore={true}
        >
          {images.map((image) => {
            const isMine = image.user.uuid === user?.uuid;
            return (
              <Image
                key={image.uuid}
                uuid={image.uuid}
                isMine={isMine}
                url={image.url}
                filename={image.filename}
                ownerName={image.user.name}
              />
            );
          })}
        </InfiniteScroll>
      </ImagesStyle>
      <UploadingProgress />
    </HomeStyle>
  );
};

const mapStateToProps = (state) => {
  return {
    images: state.images.images,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    currentSearchText: state.search.currentSearchText,
    currentLabel: state.search.currentLabel,
  };
};

export default connect(mapStateToProps, {
  fetchImages,
  deleteImages,
  deleteAllMyImages,
  executeNewSearch,
})(Home);

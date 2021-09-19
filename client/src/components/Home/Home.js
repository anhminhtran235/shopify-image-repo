import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from 'react';

import Image from '../Image/Image';
import { HomeStyle, ImagesStyle, MenuStyle } from '../styles/HomeStyle';
import DragAndDrop from '../DragAndDrop/DragAndDrop';

import { fetchImages } from '../../redux/actions/images';
import UploadingProgress from '../UploadingProgress/UploadingProgress';

const Home = ({ images, fetchImages, user, isAuthenticated }) => {
  useEffect(() => {
    fetchMoreImages();
  }, []);

  const fetchMoreImages = () => {
    const offset = images.length;
    fetchImages(offset, 10);
  };

  return (
    <HomeStyle>
      {isAuthenticated ? (
        <MenuStyle>
          <DragAndDrop />
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
                key={image.url}
                isMine={isMine}
                url={image.url}
                filename={image.filename}
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
  };
};

export default connect(mapStateToProps, { fetchImages })(Home);

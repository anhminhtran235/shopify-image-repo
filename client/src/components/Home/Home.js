import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from 'react';

import Image from '../Image/Image';
import { HomeStyle } from '../styles/HomeStyle';
import DragAndDrop from '../DragAndDrop/DragAndDrop';

import { fetchImages } from '../../redux/actions/images';

const Home = ({ images, fetchImages, user }) => {
  useEffect(() => {
    fetchMoreImages();
  }, []);

  const fetchMoreImages = () => {
    const offset = images.length;
    fetchImages(offset, 3);
  };

  return (
    <HomeStyle>
      <DragAndDrop />
      <InfiniteScroll
        dataLength={images.length}
        next={fetchMoreImages}
        hasMore={true}
      >
        {images.map((image) => {
          const isMine = image.user.uuid === user?.uuid;
          return (
            <Image isMine={isMine} url={image.url} filename={image.filename} />
          );
        })}
      </InfiniteScroll>
    </HomeStyle>
  );
};

const mapStateToProps = (state) => {
  return {
    images: state.images.images,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, { fetchImages })(Home);

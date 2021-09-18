import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import Image from '../Image/Image';
import { HomeStyle } from '../styles/HomeStyle';

import { fetchImages } from '../../redux/actions/images';
import { useEffect } from 'react';

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

import styled from 'styled-components';

export const HomeStyle = styled.div`
  display: flex;
  padding: 20px;
  background: var(--darker-grey);
`;

export const ImagesStyle = styled.div`
  .infinite-scroll-component {
    display: flex;
    flex-wrap: wrap;
    > div {
      width: 33.33%;
    }
  }
`;

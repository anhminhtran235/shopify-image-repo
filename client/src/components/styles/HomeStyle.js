import styled from 'styled-components';

export const HomeStyle = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--lighter-grey);
`;

export const MenuStyle = styled.div`
  display: flex;
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

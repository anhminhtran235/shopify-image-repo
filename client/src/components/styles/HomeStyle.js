import styled from 'styled-components';

export const HomeStyle = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--lighter-grey);
`;

export const MenuStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .option {
    display: flex;
    justify-content: center;
    align-items: center;

    .btn-group {
      display: flex;
      flex-direction: column;

      .btn:first-child {
        margin-bottom: 10px;
      }

      .btn {
        font-size: 16px;
        padding: 10px 20px;
        color: white;
        background: var(--lighter-red);
        border: 1px solid red;
        border-radius: 8px;
        :hover {
          cursor: pointer;
          background: var(--darker-red);
        }
      }
    }
  }
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

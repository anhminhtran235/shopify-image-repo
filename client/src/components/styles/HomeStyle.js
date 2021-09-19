import styled from 'styled-components';

export const HomeStyle = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--lighter-grey);
`;

export const MenuStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .option {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    .btn-group {
      display: flex;

      .btn:first-child {
        /* margin-bottom: 10px; */
      }

      .btn,
      .search-btn {
        font-size: 16px;
        padding: 10px 20px;
        color: white;
        border-radius: 8px;
        margin-left: 10px;
      }

      .btn:first-child,
      .search-btn:first-child {
        margin-left: 0px;
      }

      .btn {
        background: var(--lighter-red);
        border: 1px solid red;
        :hover {
          cursor: pointer;
          background: var(--darker-red);
        }
      }

      .search-btn {
        background: var(--lighter-blue);
        border: 1px solid var(--darker-blue);

        :hover {
          cursor: pointer;
          background: var(--darker-blue);
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

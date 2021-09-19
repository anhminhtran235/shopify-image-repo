import styled from 'styled-components';

export const UploadingProgressStyle = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  background: white;
  min-width: 400px;
  max-height: 500px;
  box-shadow: 0 0 1px 1px var(--lighter-black);
  overflow-y: auto;
`;

export const ImageProgressHeader = styled.div`
  background: var(--darker-black);
  height: 50px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;

  .close-btn {
    padding: 5px 10px;
    border-radius: 50%;
    :hover {
      color: var(--darkest-grey);
      cursor: pointer;
    }
  }
`;

export const ImagesProgressStyle = styled.div``;

export const ImageProgressStyle = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--darker-grey);

  .meta-data {
    display: flex;
    align-items: center;
    .img-extension {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .status {
    i {
      color: green;
    }
  }

  :hover {
    cursor: pointer;
    background: var(--lighter-grey);
  }
`;

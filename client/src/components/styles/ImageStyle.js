import styled from 'styled-components';

export const OutsideWrapper = styled.div``;

export const Wrapper = styled.div`
  position: relative;
  margin: 20px;

  .check-box {
    position: absolute;
    top: 10px;
    right: 10px;
    transform: scale(1.5);

    :hover {
      cursor: pointer;
    }
  }
`;

export const ImageStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 2px rgb(0 0 0 / 40%);
  background: white;
  border-radius: 8px;
  font-size: 16px;
  padding: 20px 10px;
  transition: 0.2s;
  text-align: center;

  :hover {
    transition: 0.2s;
    opacity: 70%;
    box-shadow: 0 4px 5px rgb(0 0 0 / 50%);
    cursor: pointer;
  }

  .image-outside-wrapper {
    width: 100%;
    border-radius: 8px 8px 0px 0px;

    .image-inside-wrapper {
      max-width: 300px;
      height: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: auto;
      position: relative;
      img {
        max-width: 100%;
        max-height: 100%;
        display: inline-block;
      }
    }
  }

  p {
    margin: 0;
  }

  .filename {
    margin-top: 10px;
  }

  .username {
    margin-top: 10px;
  }
`;

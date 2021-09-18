import styled from 'styled-components';

const MiniSpinnerStyle = styled.div`
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 6px 2px 2px 2px;
    border: 2px solid var(--darkest-grey);
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--darkest-grey) transparent transparent transparent;
  }
  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const MiniSpinner = () => {
  return (
    <MiniSpinnerStyle>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </MiniSpinnerStyle>
  );
};

export default MiniSpinner;

import styled, { keyframes } from 'styled-components';

export const FormPageStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--lighter-grey);
`;

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`;

export const Form = styled.form`
  background: white;
  fieldset {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
    padding: 30px 40px;
    margin-top: 100px;
    margin-bottom: 20px;
    border-radius: 8px;

    h2 {
      font-weight: bold;
    }
    input {
      margin-top: 10px;
      font-size: 16px;
      width: 350px;
      border-radius: 5px;
      padding: 5px 10px;
      border: 1px solid var(--darker-grey);
      :focus {
        outline: none;
        border: 1px solid var(--darker-blue);
      }
    }

    button {
      margin-top: 20px;
      background: var(--lighter-blue);
      color: white;
      padding: 5px 20px;
      width: 100%;
      border: 1px solid var(--lighter-blue);
      border-radius: 5px;
      :hover {
        background: var(--darker-blue);
        cursor: pointer;
      }
    }

    p {
      margin-top: 20px;
      font-size: 16px;
      a {
        color: var(--darker-blue);
      }
    }

    &[disabled] {
      opacity: 0.5;
    }
    &::before {
      height: 10px;
      display: block;
      background-image: linear-gradient(
        to right,
        var(--lighter-blue) 0%,
        white 50%,
        var(--lighter-blue) 100%
      );
    }
    &[aria-busy='true']::before {
      transform: translateY(-10px);
      content: '';
      width: 100%;
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }

    .info {
      margin: 0;
      color: var(--lighter-orange);
    }

    @media (max-width: 720px) {
      input {
        width: 250px;
      }
    }
    @media (max-width: 460px) {
      padding: 20px 30px;
      input {
        width: 200px;
      }
      p {
        font-size: 12px;
      }
    }
  }
`;

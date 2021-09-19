import styled from 'styled-components';

export const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  transition: all 1s;
  position: relative;
  margin-left: 10px;

  :hover {
    cursor: pointer;
  }

  .input-wrapper {
    width: 100%;
    i {
      display: block;
      position: absolute;
      top: 11px;
      right: 8px;
      color: grey;
    }
  }

  input {
    color: var(--lighter-black);
    transition: all 1s;
    width: 100%;
    padding: 5px 20px;
    border: 1px solid var(--darker-grey);
    :focus {
      outline: none;
    }
  }

  .dropdown {
    display: block;
  }
`;

export const Dropdown = styled.div`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 43px;
  box-shadow: 0px 3px 5px 0 rgb(0 0 0 / 30%);
`;

export const DropdownItem = styled.div`
  transition: all 0.3s;
  z-index: -1;
  justify-content: flex-start;
  background: ${(props) => (props.active ? 'var(--darker-grey)' : 'white')};
  color: black;
  border: ${(props) =>
    props.active ? '2px solid yellow' : '1px solid var(--lighter-grey)'};
  padding: 10px 20px;
  padding-left: ${(props) => (props.active ? '30px' : '10px')};
  line-height: 1;
  img {
    width: 50px;
  }
  p {
    margin: 0;
  }
  .book-info {
    margin-left: 10px;
    .book-author {
      font-size: 14px;
      font-style: italic;
      margin-top: 5px;
    }
  }
  :hover {
    background: var(--darker-grey);
    border: 2px solid yellow;
    padding-left: 30px;
  }
`;

import styled from 'styled-components';

export const DragAndDropStyle = styled.div`
  border: 3px dashed var(--lighter-black);
  padding: 10px 20px;
  text-align: center;
  width: 500px;

  background: ${(props) =>
    props.isDragActive ? 'var(--darkest-grey)' : 'var(--lighter-grey)'};

  :hover {
    background: var(--darker-grey);
    cursor: pointer;
  }
`;

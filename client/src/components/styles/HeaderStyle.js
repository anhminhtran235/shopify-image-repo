import styled from 'styled-components';

export const Logo = styled.h2`
  margin: 0;
  color: white;
  font-style: italic;
  :hover {
    cursor: pointer;
    color: var(--lighter-orange);
  }
`;

export const HeaderStyle = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px;
  background: var(--darkest-blue);

  @media (max-width: 415px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const NavLinksContainer = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding-left: 0;
  @media (max-width: 415px) {
    margin-top: 10px;
  }
`;

export const NavLink = styled.a`
  margin-left: 20px;
  :hover {
    cursor: pointer;
    color: var(--darker-blue);
    text-decoration: none;
  }

  :first-child {
    margin-left: 0;
  }
`;

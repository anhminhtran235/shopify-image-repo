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
  justify-content: space-between;
  padding: 20px;
  background: var(--darkest-blue);
`;

export const NavLinksContainer = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding-left: 0;
`;

export const NavLink = styled.a`
  margin-left: 20px;
  :hover {
    cursor: pointer;
    color: var(--darker-blue);
    text-decoration: none;
  }
`;

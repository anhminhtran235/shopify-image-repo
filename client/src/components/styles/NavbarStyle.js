import styled from 'styled-components';

export const NavbarStyle = styled.nav`
  display: flex;
  justify-content: right;
  padding: 20px;
  background: var(--lighter-blue);
`;

export const NavLinksContainer = styled.ul`
  display: flex;
  margin: 0;
  padding-left: 0;
`;

export const NavLink = styled.a`
  margin-left: 20px;
  :hover {
    cursor: pointer;
    color: white;
    text-decoration: none;
  }
`;

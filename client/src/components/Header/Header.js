import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Logo,
  HeaderStyle,
  NavLink,
  NavLinksContainer,
} from '../styles/HeaderStyle';
import LogoutButton from './LogoutButton';

const Header = ({ isAuthenticated }) => {
  return (
    <HeaderStyle>
      <Logo>Image Repo</Logo>

      <NavLinksContainer>
        <NavLink as={Link} to='/'>
          Home
        </NavLink>

        {!isAuthenticated && (
          <NavLink as={Link} to='/login'>
            Login
          </NavLink>
        )}

        {!isAuthenticated && (
          <NavLink as={Link} to='/register'>
            Register
          </NavLink>
        )}

        {isAuthenticated && <LogoutButton />}
      </NavLinksContainer>
    </HeaderStyle>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps)(Header);

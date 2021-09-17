import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { NavbarStyle, NavLink, NavLinksContainer } from '../styles/NavbarStyle';
import LogoutButton from './LogoutButton';

const Navbar = ({ isAuthenticated }) => {
  return (
    <NavbarStyle>
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
    </NavbarStyle>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps)(Navbar);

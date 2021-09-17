import alertify from 'alertifyjs';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { logout } from '../../redux/actions/auth';
import { NavLink } from '../styles/NavbarStyle';

const LogoutButton = ({ logout }) => {
  const onClick = () => {
    logout();
    alertify.success('Logout successfully');
  };

  return <NavLink onClick={onClick}>Logout</NavLink>;
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(LogoutButton));

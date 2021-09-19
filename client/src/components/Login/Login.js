import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect, Link } from 'react-router-dom';

import useForm from '../../util/useForm';
import { Form, FormPageStyle } from '../styles/FormStyle';
import { login } from '../../redux/actions/auth';

const Login = ({ login, isAuthenticated, loading }) => {
  const { form, handleChange } = useForm({
    username: 'minh123',
    password: '123456',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    login({ name: form.username, password: form.password });
  };

  return isAuthenticated ? (
    <Redirect to='/' />
  ) : (
    <FormPageStyle>
      <Form onSubmit={onSubmit}>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Login </h2>
          <p class='info'>
            You can use this testing account or create your own
          </p>
          <input
            type='text'
            placeholder='Username'
            value={form.username}
            name='username'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            value={form.password}
            name='password'
            onChange={handleChange}
          />
          <button type='submit'>Login</button>
          <p>
            New to this website? <Link to='/register'>Register here</Link>
          </p>
        </fieldset>
      </Form>
    </FormPageStyle>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
  };
};

export default withRouter(connect(mapStateToProps, { login })(Login));

import alertify from 'alertifyjs';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect, Link } from 'react-router-dom';

import useForm from '../../util/useForm';
import { Form, FormPageStyle } from '../styles/FormStyle';
import { register } from '../../redux/actions/auth';

const Register = ({ register, isAuthenticated, loading }) => {
  const { form, handleChange } = useForm({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alertify.error('Password must match');
    } else {
      register({ name: form.username, password: form.password });
    }
  };

  return isAuthenticated ? (
    <Redirect to='/' />
  ) : (
    <FormPageStyle>
      <Form onSubmit={onSubmit}>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Create Account</h2>
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
            data-test-id='password'
          />
          <input
            type='password'
            placeholder='Confirm password'
            value={form.confirmPassword}
            name='confirmPassword'
            onChange={handleChange}
          />
          <button type='submit'>Sign up</button>
          <p>
            Already have an account? <Link to='/login'>Login here</Link>
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

export default withRouter(connect(mapStateToProps, { register })(Register));

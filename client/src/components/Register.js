import alertify from 'alertifyjs';
import { connect } from 'react-redux';

import useForm from '../util/useForm';
import { Form, FormPageStyle } from './styles/FormStyle';
import { register } from '../redux/actions/auth';

const Register = ({ register }) => {
  const { form, handleChange } = useForm({
    username: 'Anh Minh',
    password: '123456',
    confirmPassword: '123456',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alertify.error('Password must match');
    } else {
      register({ name: form.username, password: form.password });
    }
  };

  const loading = false;

  return (
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
          />
          <input
            type='password'
            placeholder='Confirm password'
            value={form.confirmPassword}
            name='confirmPassword'
            onChange={handleChange}
          />
          <button type='submit'>Sign up</button>
        </fieldset>
      </Form>
    </FormPageStyle>
  );
};

export default connect(null, { register })(Register);

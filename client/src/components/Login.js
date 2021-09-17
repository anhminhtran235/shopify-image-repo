import { connect } from 'react-redux';

import useForm from '../util/useForm';
import { Form, FormPageStyle } from './styles/FormStyle';
import { login } from '../redux/actions/auth';

const Login = ({ login }) => {
  const { form, handleChange } = useForm({
    username: 'Anh Minh',
    password: '123456',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    login({ name: form.username, password: form.password });
  };

  const loading = false;

  return (
    <FormPageStyle>
      <Form onSubmit={onSubmit}>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Login to your account</h2>
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
        </fieldset>
      </Form>
    </FormPageStyle>
  );
};

export default connect(null, { login })(Login);

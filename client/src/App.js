import { Provider } from 'react-redux';
import { useEffect } from 'react';

import './App.css';
import 'alertifyjs/build/css/alertify.css';

import store from './redux/store';

import { getMe } from './redux/actions/auth';
import Page from './components/Page/Page';

const App = () => {
  useEffect(() => {
    store.dispatch(getMe());
  }, []);

  return (
    <Provider store={store}>
      <Page />
    </Provider>
  );
};

export default App;

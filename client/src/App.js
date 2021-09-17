import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'alertifyjs/build/css/alertify.css';
import { Provider } from 'react-redux';

import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

import store from './redux/store';
import GlobalStyles from './components/styles/GlobalStyles';
import PrivateRoute from './components/Route/PrivateRoute';
import Secret from './components/Secret';
import { useEffect } from 'react';
import { getMe } from './redux/actions/auth';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  useEffect(() => {
    store.dispatch(getMe());
  }, []);

  return (
    <Provider store={store}>
      <GlobalStyles />
      <BrowserRouter>
        <Navbar />

        <Switch>
          <Route exact path='/' component={Home}></Route>
          <Route exact path='/login' component={Login}></Route>
          <Route exact path='/register' component={Register}></Route>
          <PrivateRoute exact path='/secret' component={Secret}></PrivateRoute>
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

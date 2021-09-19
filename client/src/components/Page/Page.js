import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import GlobalStyles from '../styles/GlobalStyles';
import Header from '../Header/Header';

import Home from '../Home/Home';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Loader from '../Loader/Loader';

const Page = ({ showLoader }) => {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Header />
        {showLoader && <Loader />}
        <Switch>
          <Route exact path='/' component={Home}></Route>
          <Route exact path='/login' component={Login}></Route>
          <Route exact path='/register' component={Register}></Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    showLoader: state.ui.showLoader,
  };
};

export default connect(mapStateToProps)(Page);

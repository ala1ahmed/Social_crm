import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './utils/PrivateRoute';

import Register from './views/examples/Register';
import RegisterCM from './views/examples/RegisterCM';
import Login from './views/examples/Login';
import Reset from './views/examples/Reset';
import Resetting from './views/examples/Resetting';
import EmailVerification from './views/examples/EmailVerification';
import Dashboard from './views/Index';
import Profile from './views/examples/Profile';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Route exact path='/register' component={Register} />
            <Route
              exact
              path='/community-manager/register'
              component={RegisterCM}
            />
            <Route exact path='/login' component={Login} />
            <Route exact path='/reset' component={Reset} />
            <Route exact path='/reset/:token' component={Resetting} />
            <Route
              exact
              path='/email-verification/:token'
              component={EmailVerification}
            ></Route>

            <Switch>
              <PrivateRoute exact path='/' component={Dashboard} />
              <PrivateRoute exact path='/user-profile' component={Profile} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

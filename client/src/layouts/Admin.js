import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
// reactstrap components
import { Container } from 'reactstrap';
// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import AdminFooter from 'components/Footers/AdminFooter.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import routes from 'routes.js';
import PrivateRoute from '../utils/PrivateRoute';
import Profile from '../views/examples/Profile';
import Index from '../views/Index';

class Admin extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/admin') {
        return (
          <PrivateRoute
            exact
            path={prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return 'Brand';
  };
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: '/',
            imgSrc: require('assets/img/brand/argon-react-white.png'),
            imgAlt: '...',
          }}
        />
        <div className='main-content' ref='mainContent'>
          <AdminNavbar {...this.props} brandText={'Socail CRM'} />
          <Switch>
            <PrivateRoute exact path='/user-profile' component={Profile} />
            <PrivateRoute exact path='/' component={Index} />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;

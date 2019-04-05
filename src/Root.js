import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';
import Layout from './Layout';
import store from './store';
import SessionHOC from './SessionHOC';

import Public from './Routes/Public';
import Signup from './Routes/Signup';
import Dashboard from './Routes/Dashboard';

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <SessionHOC>
            <Layout>
              <Route exact path={'/'} component={Public} />
              <Route exact path={'/signup'} component={Signup} />
              <Route
                path='/dashboard/:dashboardLocation/:subRoute?/:identifier?'
                component={Dashboard}
              />
            </Layout>
          </SessionHOC>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default Root;

import React, { Component } from 'react';
import { Form, Button, Icon, Input, Card } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import mainImage from '../../Assets/FT_LOGO3.png';
import { withFirebase } from '../../Firebase';

import './Public.scss';

class LoginContainer extends Component {
  state = {
    forgotPassword: false
  };

  render() {
    const { forgotPassword } = this.state;
    return (
      <Card className='login-card'>
        <img alt='' src={mainImage} className='login-image' />
        {forgotPassword ? <ForgotPassword /> : <Login />}
        {!forgotPassword && (
          <span
            onClick={() => this.setState({ forgotPassword: true })}
            className='forgot-password'
          >
            Forgot your password?
          </span>
        )}
      </Card>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(LoginContainer);

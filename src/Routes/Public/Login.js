import React, { Component } from 'react';
import { Form, Button, Icon, Input, Card } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import mainImage from '../../Assets/FT_LOGO3.png';

import { withFirebase } from '../../Firebase';

import './Public.scss';

class Login extends Component {
  handleSubmit = e => {
    const { firebase, history } = this.props;
    console.log('asdfasdf');
    e.preventDefault();
    const { form } = this.props;
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (!err) {
        try {
          console.log('in the try');
          await firebase.doSignInWithEmailAndPassword(
            values.userName,
            values.password
          );
          history.push('/dashboard/home');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Card className='login-card'>
        <img alt='' src={mainImage} className='login-image' />
        <Form onSubmit={this.handleSubmit} className='login-form'>
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [
                { required: true, message: 'Please input your username!' }
              ]
            })(
              <Input
                prefix={
                  <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder='Username'
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' }
              ]
            })(
              <Input
                prefix={
                  <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type='password'
                placeholder='Password'
              />
            )}
          </Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button'
          >
            Log In
          </Button>
          <br />
          <span className='forgot-password'>Forgot your password?</span>
        </Form>
      </Card>
    );
  }
}

const LoginForm = Form.create({ name: 'horizontal_login' })(Login);

export default compose(
  withRouter,
  withFirebase
)(LoginForm);

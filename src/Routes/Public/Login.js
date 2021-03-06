import React, { Component } from 'react';
import { Form, Button, Icon, Input, Card } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

class Login extends Component {
  handleSubmit = e => {
    const { form } = this.props;
    const { firebase, history } = this.props;
    e.preventDefault();
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (!err) {
        try {
          await firebase.doSignInWithEmailAndPassword(
            values.email,
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
      <Form onSubmit={this.handleSubmit} className='login-form'>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }]
          })(
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Email'
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Password'
            />
          )}
        </Form.Item>
        <Button type='primary' htmlType='submit' className='login-form-button'>
          Log In
        </Button>
        <br />
      </Form>
    );
  }
}

const LoginForm = Form.create({ name: 'horizontal_login' })(Login);

export default compose(
  withRouter,
  withFirebase
)(LoginForm);

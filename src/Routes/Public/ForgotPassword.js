import React, { Component } from 'react';
import { Form, Button, Icon, Input, Card } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

class ForgotPasswordForm extends Component {
  handleSubmit = e => {
    const { form } = this.props;
    const { firebase, history } = this.props;
    e.preventDefault();
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (!err) {
        try {
          await firebase.sendPasswordReset(values.email);
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
        <span style={{ color: 'white', marginnTop: '-20px' }}>
          Please enter your email.
        </span>
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

        <Button type='primary' htmlType='submit' className='login-form-button'>
          Reset Password
        </Button>
        <br />
      </Form>
    );
  }
}

const ForgotPassword = Form.create({ name: 'horizontal_login' })(
  ForgotPasswordForm
);

export default compose(
  withRouter,
  withFirebase
)(ForgotPassword);

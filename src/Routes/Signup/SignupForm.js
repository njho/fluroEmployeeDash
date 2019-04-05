import React, { Component } from 'react';
import { Form, Button, Icon, Input } from 'antd';
import { withRouter } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { compose } from 'recompose';

class SignupForm extends Component {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSubmit} className='login-form'>
        <br />
        <QueueAnim type='bottom'>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: 'Please provide us your name!' }
              ]
            })(
              <Input
                prefix={
                  <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder='Name'
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Please input your Password!' }
              ]
            })(
              <Input
                prefix={
                  <Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type='email'
                placeholder='Valid E-mail'
              />
            )}
          </Form.Item>
          <Form.Item style={{ textAlign: 'left', width: '100%' }}>
            <Button type='primary' size='large' htmlType='submit'>
              Request Access
              <Icon
                type='arrow-right'
                color='white'
                style={{ paddingLeft: '3px' }}
              />
            </Button>
          </Form.Item>
        </QueueAnim>
      </Form>
    );
  }
}

const LoginForm = Form.create({ name: 'horizontal_login' })(SignupForm);

export default compose(withRouter)(LoginForm);

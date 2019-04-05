import React, { Component } from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  Row,
  Col,
  Select,
  notification
} from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import axios from 'axios';
import { withFirebase } from '../../../../Firebase';

const { Option } = Select;

/**
 * @param {object} companyInfo a companyInfo object
 */
class NewAccountForm extends Component {
  state = { disabled: false };

  failureNotification = () => {
    notification.info({
      message: 'An error occured creating this user.',
      description: 'Please try again.'
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      form,
      companyInfo: { companyId },
      firebase,
      history
    } = this.props;
    const { validateFields } = form;

    validateFields((err, values) => {
      console.log(values);
      if (!err) {
        axios
          .post(
            'https://us-central1-sure-fuel-e5a00.cloudfunctions.net/createInternalUser',
            {
              ...values,
              companyId
            }
          )
          .then(async response => {
            form.resetFields();

            if (response.status === 200) {
              try {
                console.log(values.email);
                await firebase.doPasswordReset(values.email);
                history.push('/dashboard/accounts');
                this.setState({
                  disabled: false
                });
              } catch (error) {
                this.failureNotification();
                this.setState({
                  disabled: false
                });
              }
            }
          })
          .catch(error => {
            form.resetFields();
            this.failureNotification();
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            this.setState({
              disabled: false
            });
          });
        this.setState({
          disabled: true
        });
      }
    });
  };

  handleChange(value) {
    this.setState({ role: value });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { disabled } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <br />
        <h3>Account Information</h3>
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 11, offset: 0 }}>
            <Form.Item
              key='a'
              label='First Name'
              style={{
                width: '100%',
                marginBottom: '12px'
              }}
            >
              {getFieldDecorator('firstName', {
                rules: [
                  { required: true, message: 'Please provide a First Name.' }
                ]
              })(
                <Input
                  autoComplete='off'
                  name='firstName'
                  prefix={
                    <Icon
                      type='user'
                      style={{
                        width: '100%',
                        color: 'rgba(0,0,0,.25)'
                      }}
                    />
                  }
                  placeholder='First Name'
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 11, offset: 1 }}>
            <Form.Item
              key='lastName'
              label='Last Name'
              style={{
                width: '100%',
                marginBottom: '12px'
              }}
            >
              {getFieldDecorator('lastName', {
                rules: [
                  { required: true, message: 'Please provide a Last Name.' }
                ]
              })(
                <Input
                  autoComplete='off'
                  name='lastName'
                  prefix={
                    <Icon
                      type='user'
                      style={{
                        width: '100%',
                        color: 'rgba(0,0,0,.25)'
                      }}
                    />
                  }
                  placeholder='Last Name'
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 11, offset: 0 }}>
            <Form.Item
              key='a'
              autoComplete='off'
              label='E-mail'
              style={{
                width: '100%',
                marginBottom: '12px'
              }}
            >
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please provide an email' }]
              })(
                <Input
                  autoComplete='off'
                  name='email'
                  type='email'
                  prefix={
                    <Icon
                      type='mail'
                      style={{
                        width: '100%',
                        color: 'rgba(0,0,0,.25)'
                      }}
                    />
                  }
                  placeholder='Email'
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 11, offset: 1 }}>
            <Form.Item
              key='role'
              label='Account Role'
              style={{
                width: '100%',
                marginBottom: '12px'
              }}
            >
              {getFieldDecorator('role', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter an account Role'
                  }
                ]
              })(
                <Select name='type' onChange={e => this.handleChange(e)}>
                  <Option value='admin'>Administrator</Option>
                  <Option value='employee'>Employee</Option>
                </Select>
              )}
            </Form.Item>
          </Col>{' '}
        </Row>

        <br />

        <br />

        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 23, offset: 0 }}>
            <Form.Item key='c' style={{ float: 'right' }}>
              <Button
                type='primary'
                htmlType='submit'
                disabled={disabled}
                loading={disabled}
              >
                Submit{' '}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const LoginForm = Form.create({ name: 'horizontal_login' })(NewAccountForm);

export default compose(
  withRouter,
  withFirebase
)(LoginForm);

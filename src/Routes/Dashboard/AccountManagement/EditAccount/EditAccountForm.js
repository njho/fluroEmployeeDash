import React, { Component } from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  Row,
  Col,
  Popconfirm,
  Select,
  notification
} from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import axios from 'axios';
import { connect } from 'react-redux';
import { withFirebase } from '../../../../Firebase';

const { Option } = Select;

class NewAccountForm extends Component {
  state = { disabled: false };

  failureNotification = () => {
    notification.info({
      message: 'An error occured updating this User',
      description: 'Please try again.'
    });
  };

  /**
   * @param {Synthetic Event} event
   * @param {string} type One of `put` or `delete`
   */
  updateUser = type => {
    const {
      form,
      companyInfo: { companyId },
      history,
      match
    } = this.props;
    const { validateFields } = form;

    validateFields((err, values) => {
      let body = {
        ...values,
        companyId,
        docId: match.params.identifier
      };
      if (type === 'delete') {
        body = { data: body };
      }
      if (!err) {
        axios[type](
          'https://us-central1-sure-fuel-e5a00.cloudfunctions.net/createInternalUser',
          body
        )
          .then(async response => {
            form.resetFields();
            console.log(response);
            if (response.status === 200) {
              try {
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
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { account } = this.props;
    const { disabled } = this.state;
    return (
      <Form>
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
                initialValue: account.firstName,
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
                initialValue: account.lastName,
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
              label='E-mail Contact'
              style={{
                width: '100%',
                marginBottom: '12px'
              }}
            >
              {getFieldDecorator('email', {
                initialValue: account.email,
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
                initialValue: account.role,
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
                  <Option value='none'>None</Option>
                </Select>
              )}
            </Form.Item>
          </Col>{' '}
        </Row>
        Note that changing their e-mail will not affect their login.
        <br />
        <br />
        <Row>
          <Col key='c' xs={{ span: 24 }} lg={{ span: 23, offset: 0 }}>
            <Form.Item style={{ float: 'right', marginLeft: '5px' }}>
              <Button
                type='primary'
                disabled={disabled}
                loading={disabled}
                onClick={() => this.updateUser('put')}
              >
                Update{' '}
              </Button>
            </Form.Item>

            <Form.Item style={{ float: 'right' }}>
              <Popconfirm
                title='Are you sure you would like to delete this user and revoke their permissions?'
                onConfirm={() => this.updateUser('delete')}
                // onCancel={cancel}
                okText='Yes'
                cancelText='No'
              >
                <Button type='danger' disabled={disabled} loading={disabled}>
                  Delete Account{' '}
                </Button>
              </Popconfirm>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const LoginForm = Form.create({ name: 'horizontal_login' })(NewAccountForm);

const mapStateToProps = state => ({
  account: state.accounts.editAccount
});

export default compose(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
    {}
  )
)(LoginForm);

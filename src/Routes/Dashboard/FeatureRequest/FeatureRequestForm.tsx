import React, { Component } from 'react';
import { Form, Button, Icon, Input, Row, Col, notification } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import QueueAnim from 'rc-queue-anim';

import { withFirebase } from '../../../Firebase';
import { Dispatch } from 'redux';
import { IRootState, ICompanyInfo } from '../../../types/types';
import { IDoc } from '../../../types/firebaseTypes';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
/**
 * OwnProps is passed down from the Parent
 */
interface OwnProps extends RouteComponentProps {}
/**
 * Dispatched State from Redux
 */
interface StateProps {
  firebase: any;
  companyInfo: ICompanyInfo;
}
/**
 * Dispatched Props from Redux
 */
interface DispatchProps {}
/**
 * Local State
 */
interface State {
  loading: boolean;
}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps & FormComponentProps;

const { TextArea } = Input;

class FeatureRequestForm extends Component<Props, State> {
  state = {
    loading: false
  };

  successNotification = (message: string) => {
    notification.success({
      message
    });
  };

  handleSubmit = (e: any) => {
    const { firebase, history } = this.props;
    e.preventDefault();
    const { form } = this.props;
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (!err) {
        try {
          this.setState({ loading: true });
          console.log({ values });
          await firebase
            .firestoreAccess()
            .collection('featureRequests')
            .add({
              ...values,
              active: true
            });
          this.setState({ loading: false });
          this.successNotification('Feature Request Submitted!');

          form.resetFields();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  render() {
    const { form } = this.props;
    const { loading } = this.state;
    const { getFieldDecorator } = form;

    return (
      <div className='home-container'>
        <Form onSubmit={this.handleSubmit}>
          <QueueAnim type='bottom'>
            <Row>
              <Col xs={{ span: 11 }} lg={{ span: 11, offset: 0 }}>
                <Form.Item label='Name' className='no-row-padding'>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: 'Please provide us your name!'
                      }
                    ]
                  })(
                    <Input prefix={<Icon type='user' />} placeholder='Name' />
                  )}
                </Form.Item>
              </Col>
              <Col xs={{ span: 12, offset: 1 }} lg={{ span: 12, offset: 1 }}>
                <Form.Item label='E-mail' className='no-row-padding'>
                  {getFieldDecorator('email', {
                    rules: [
                      { required: true, message: 'Please provide your email!' }
                    ]
                  })(
                    <Input
                      prefix={<Icon type='mail' />}
                      type='email'
                      placeholder='E-mail'
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label='Please describe your feature request'>
              {getFieldDecorator('description', {
                rules: [
                  { required: true, message: 'Please provide your email!' }
                ]
              })(
                <TextArea
                  rows={4}
                  placeholder='What would you like integrated and why is this important?'
                />
              )}
            </Form.Item>

            <Form.Item
              style={{ textAlign: 'right', width: '100%', marginTop: '20px' }}
            >
              <Button
                loading={loading}
                style={{ backgroundColor: '#2cb5e8', border: 'none' }}
                type='primary'
                size='large'
                htmlType='submit'
              >
                <Icon type='audit' />
                Submit Feature Request
                <Icon type='arrow-right' style={{ paddingLeft: '3px' }} />
              </Button>
            </Form.Item>
          </QueueAnim>
        </Form>
      </div>
    );
  }
}

const FeatureForm = Form.create({ name: 'horizontal_login' })(
  FeatureRequestForm
);

const mapStateToProps = (state: IRootState): any => ({
  companyInfo: state.company
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({});

export default compose<any, any>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withFirebase
)(FeatureForm);

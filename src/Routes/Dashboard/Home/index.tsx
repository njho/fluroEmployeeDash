import React, { Component } from 'react';
import { Form, Button, Icon, Input, Upload, message, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import QueueAnim from 'rc-queue-anim';

import { withFirebase } from '../../../Firebase';
import { Dispatch } from 'redux';
import {
  IRootState,
  ICompanyInfo,
  ICompanyCreditCard,
  ICompanySubscription
} from '../../../types/types';
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
interface State {}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps & FormComponentProps;

const { TextArea } = Input;
const Dragger = Upload.Dragger;
const props = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info: any) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

class HomeForm extends Component<Props, State> {
  async componentDidMount() {
    const { firebase, companyInfo } = this.props;

    if (companyInfo.company.companyId) {
      let response = await firebase
        .companySubscription(companyInfo.company.companyId)
        .get();
      if (response.exists) {
      }
    }
  }

  handleSubmit = (e: any) => {
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
      <>
        <h1>Submit a Bug Report</h1>
        <Form onSubmit={this.handleSubmit}>
          <QueueAnim type='bottom'>
            <Row>
              <Col xs={{ span: 11 }} lg={{ span: 11, offset: 0 }}>
                <Form.Item label='Name'>
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
              <Col xs={{ span: 11 }} lg={{ span: 12, offset: 1 }}>
                <Form.Item label='E-mail'>
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
            <Form.Item label='Please describe the issue'>
              <TextArea
                rows={4}
                placeholder='How did this occur? What events lead to the bug?'
              />
            </Form.Item>
            <Dragger {...props}>
              <p className='ant-upload-drag-icon'>
                <Icon type='inbox' />
              </p>
              <p className='ant-upload-text'>
                Click or drag file to this area to upload
              </p>
              <p className='ant-upload-hint'>
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </Dragger>
            ,
            <Form.Item
              style={{ textAlign: 'right', width: '100%', marginTop: '20px' }}
            >
              <Button type='primary' size='large' htmlType='submit'>
                Submit Report
                <Icon type='arrow-right' style={{ paddingLeft: '3px' }} />
              </Button>
            </Form.Item>
          </QueueAnim>
        </Form>
      </>
    );
  }
}

const Home = Form.create({ name: 'horizontal_login' })(HomeForm);

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
)(Home);

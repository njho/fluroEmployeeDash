import React, { Component } from 'react';
import {
  Form,
  Button,
  Icon,
  Input,
  Upload,
  message,
  Row,
  Col,
  notification
} from 'antd';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import QueueAnim from 'rc-queue-anim';

import { withFirebase } from '../../../Firebase';
import { Dispatch } from 'redux';
import { IRootState, ICompanyInfo } from '../../../types/types';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
import BugList from './BugList';
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

const dummyRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

class HomeForm extends Component<Props, State> {
  state = { data: { name: null }, uploading: false };

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

  successNotification = (message: string) => {
    notification.success({
      message
    });
  };

  loaderProps = {
    accept: '.pdf, .doc,.docx, .png, .jpg, ',
    data: (data: any) => {
      console.log(data);
      this.setState({ data: data });
    },
    customRequest: (thing: any) => dummyRequest(thing),
    name: 'file',
    showUploadList: false
  };

  handleSubmit = (e: any) => {
    const { firebase, history } = this.props;
    e.preventDefault();
    const { form } = this.props;
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (!err) {
        try {
          this.setState({ uploading: true });
          const { firebase } = this.props;
          const { data } = this.state;
          let url: string;

          if (data.name) {
            let uploadTask = firebase
              .storageAccess()
              .ref(`/features/${data.name}`)
              .put(data);

            uploadTask.on(
              'state_changed',
              function(snapshot: any) {
                var progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case 'paused': // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case 'running': // or 'running'
                    console.log('Upload is running');
                    break;
                }
              },
              function(error: any) {
                // Handle unsuccessful uploads
              },
              async () => {
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then(async (downloadUrl: string) => {
                    url: downloadUrl;
                    console.log('File available at', downloadUrl);
                    await firebase
                      .firestoreAccess()
                      .collection('bugReports')
                      .add({
                        name: values.name,
                        email: values.email,
                        description: values.description,
                        timestamp: Date.now(),
                        downloadUrl,
                        active: true
                      });
                    this.successNotification('Document successfully uploaded!');
                    form.resetFields();
                    this.setState({ data: { name: null }, uploading: false });
                  });
              }
            );
          } else {
            await firebase
              .firestoreAccess()
              .collection('bugReports')
              .add({
                name: values.name,
                email: values.email,
                description: values.description,
                timestamp: Date.now(),
                downloadUrl: null
              });
            this.successNotification('Successfully submitted bug report!');
            form.resetFields();
            this.setState({ data: { name: null }, uploading: false });
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { data, uploading } = this.state;

    return (
      <div className='home-container'>
        <h1>Submit a Bug Report</h1>
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
            <Form.Item label='Please describe the issue'>
              {getFieldDecorator('description', {
                rules: [
                  { required: true, message: 'Please provide your email!' }
                ]
              })(
                <TextArea
                  rows={4}
                  placeholder='How did this occur? What events lead to the bug?'
                />
              )}
            </Form.Item>
            <Dragger {...this.loaderProps}>
              <p className='ant-upload-drag-icon'>
                <Icon type='file-protect' /> {data.name}
              </p>
              <p className='ant-upload-text'>
                Click or drag file to this area to upload
              </p>
            </Dragger>
            <Form.Item
              style={{ textAlign: 'right', width: '100%', marginTop: '20px' }}
            >
              <Button
                style={{ backgroundColor: '#2cb5e8', border: 'none' }}
                type='primary'
                size='large'
                htmlType='submit'
                loading={uploading}
              >
                <Icon type='security-scan' />
                Submit Report
                <Icon type='arrow-right' style={{ paddingLeft: '3px' }} />
              </Button>
            </Form.Item>
          </QueueAnim>
        </Form>
        <Row>
          <Col span={24}>
            <BugList />
          </Col>
        </Row>
      </div>
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

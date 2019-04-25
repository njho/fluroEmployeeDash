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
import {
  IRootState,
  ICompanyInfo,
  ICompanyCreditCard
} from '../../../types/types';
import { IDoc } from '../../../types/firebaseTypes';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
import { RcFile } from 'antd/lib/upload/interface';
import {
  getFileType,
  checkFileSize,
  fileMimeMap
} from '../../../types/fileTypes';
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
  data: any;
  uploading: boolean;
}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps & FormComponentProps;

const { TextArea } = Input;
const Dragger = Upload.Dragger;
const dummyRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

class HomeForm extends Component<Props, State> {
  state = { data: { name: null }, uploading: false };

  successNotification = (message: string) => {
    notification.success({
      message
    });
  };

  loaderProps = {
    accept: '.pdf',
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
      console.log(values);
      if (!err) {
        try {
          this.setState({ uploading: true });
          const { firebase } = this.props;
          const { data } = this.state;
          let url: string;
          let uploadTask = firebase
            .storageAccess()
            .ref(`/documents/${data.name}`)
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
                    .collection('documents')
                    .add({
                      title: values.title,
                      description: values.description,
                      downloadUrl
                    });
                  this.successNotification('Document successfully uploaded!');
                  form.resetFields();
                  this.setState({ data: { name: null }, uploading: false });
                });
            }
          );
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
        <h1>Upload a Document</h1>
        <Form autoComplete='off' onSubmit={this.handleSubmit}>
          <QueueAnim type='bottom'>
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                <Form.Item label='Title' className='no-row-padding'>
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: 'Please provide a document title!'
                      }
                    ]
                  })(<Input autoComplete='off' placeholder='Document Title' />)}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label='Please describe the document'>
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: 'Please provide a document description!'
                  }
                ]
              })(
                <TextArea
                  rows={4}
                  autoComplete='off'
                  placeholder='These keywords will be used within the search.'
                />
              )}
            </Form.Item>
            {data.name ? (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Icon style={{ fontSize: '30px' }} type='inbox' /> {' - '}{' '}
                {data.name}
              </span>
            ) : (
              <Dragger {...this.loaderProps}>
                <p className='ant-upload-drag-icon'>
                  <Icon type='file-protect' /> {data.name}
                </p>
                <p className='ant-upload-text'>
                  Click or drag file to this area to upload
                </p>
              </Dragger>
            )}

            <Form.Item
              style={{ textAlign: 'right', width: '100%', marginTop: '20px' }}
            >
              <Button
                loading={uploading}
                style={{ backgroundColor: '#2cb5e8', border: 'none' }}
                type='primary'
                size='large'
                htmlType='submit'
              >
                <Icon type='security-scan' />
                Submit Document
                <Icon type='arrow-right' style={{ paddingLeft: '3px' }} />
              </Button>
            </Form.Item>
          </QueueAnim>
        </Form>
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

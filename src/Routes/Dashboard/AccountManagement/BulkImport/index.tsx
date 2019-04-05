import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Row,
  Col,
  Icon,
  Button,
  Upload,
  message,
  Alert,
  List,
  Divider,
  Tag,
  notification
} from 'antd';
import QueueAnim from 'rc-queue-anim';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFirebase } from '../../../../Firebase';
import { Dispatch } from 'redux';
import Papa, { ParseResult } from 'papaparse';
import CSV_CONSTANTS from './Constants';
import axios from 'axios';

const Dragger = Upload.Dragger;

import {
  ICompanyInfo,
  ICompanyEmployee,
  IRootState
} from './../../../../types/types';

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
interface DispatchProps {
  updateCompanyEmployees: (employees: ICompanyEmployee[]) => void;
  setEditAccount: (employee: ICompanyEmployee) => void;
}
/**
 * Local State
 */
interface State {
  newUsers: ICompanyEmployee[];
  disabled: boolean;
}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps;

class BulkImport extends React.Component<Props, State> {
  state: State = {
    newUsers: [],
    disabled: false
  };

  updateData = (parseResult: ParseResult): void => {
    console.log(parseResult);
    parseResult.data.forEach(
      (user: ICompanyEmployee, index: number): void => {
        if (
          !user.firstName ||
          !user.lastName ||
          !user.email ||
          !user.role ||
          (user.role !== 'employee' && user.role !== 'admin') ||
          !this.emailIsValid(user.email)
        ) {
          delete parseResult.data[index];
        }
      }
    );

    var filtered = parseResult.data.filter(function(el) {
      return el != null;
    });

    this.setState({ newUsers: filtered });
  };

  emailIsValid(email: string): boolean {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  createTemplateCSV = () => {
    let csvContent = '';

    CSV_CONSTANTS.forEach(rowArray => {
      const row = rowArray.join(',');
      csvContent += `${row}\r\n`;
    });

    const pom = document.createElement('a');
    const blob = new Blob([csvContent]);
    const url = URL.createObjectURL(blob);

    pom.href = url;
    pom.setAttribute('download', `BULK_UPLOAD_TEMPLATE.csv`);
    pom.click();
  };

  failureNotification = () => {
    notification.info({
      message: 'An error occured updating this User',
      description: 'Please try again.'
    });
  };

  uploadAccounts = () => {
    console.log('upload accounts');
    const { newUsers } = this.state;
    const {
      companyInfo: {
        company: { companyId }
      },
      history,
      firebase
    } = this.props;

    this.setState({ disabled: true });
    Promise.all(
      newUsers.map((user: ICompanyEmployee, index: number) => {
        console.log(index);
        console.log(user.firstName);
        return axios({
          method: 'post',
          url:
            'https://us-central1-sure-fuel-e5a00.cloudfunctions.net/createInternalUser',
          data: {
            ...user,
            companyId
          }
        }).catch(err => {
          console.log('in local error');
          err.index = index;
          throw err;
        });
      })
    )
      .then(results => {
        console.log('in results');
        console.log(results);
        newUsers.forEach(async (item: any) => {
          await firebase.doPasswordReset(item.email);
        });
        history.push('/dashboard/accounts');
      })
      .catch((errors: any) => {
        console.log('in here');
        console.log(errors.index);
        message.error(
          `User upload failed for ${newUsers[errors.index].firstName} ${
            newUsers[errors.index].lastName
          } failed. It is possible others have failed as well.`
        );
        history.push('/dashboard/accounts');
      });
  };

  render() {
    const { newUsers, disabled } = this.state;
    const props = {
      name: 'file',
      multiple: true,
      action: '//jsonplaceholder.typicode.com/posts/',
      accept: '.csv',
      data: (file: File) =>
        new Promise((resolve, reject) => {
          let csvData = Papa.parse(file, {
            complete: this.updateData,
            header: true
          });
          resolve();
        }),
      onChange(info: any) {
        const status = info.file.status;
        console.log(status);
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }

        if (status === 'done') {
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    };

    return (
      <Row>
        <Col span={24}>
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            Bulk Import Accounts
            <Button onClick={() => this.createTemplateCSV()}>
              Download CSV Template
            </Button>
          </h2>
          <h4>
            You can import multiple accounts with us through using{' '}
            <strong>CSVs.</strong>
          </h4>
          <h4>
            Please ensure that the csvs follow the format of the template CSV
            provided. Please note that any deviations will result in an upload
            failure.
          </h4>
          <br />
          <Dragger {...props}>
            <p className='ant-upload-drag-icon'>
              <Icon type='inbox' />
            </p>
            <p className='ant-upload-text'>
              Click or drag the altered Template CSV to this area to upload.
            </p>
            <p className='ant-upload-hint'>
              Please ensure that roles are of either type <u>admin</u>, or{' '}
              <u>employee</u>.
            </p>
          </Dragger>
          <br />
          <Alert
            message={
              <div>
                <strong>
                  Please include new users only. Re-adding existing users and/or
                  duplicate CSV entries are not supported.
                </strong>
                <br />
                In these scenarios the company administrator may be required to
                manually integrate these accounts due to errors/collisions.
              </div>
            }
            type='warning'
            showIcon
          />{' '}
          <Divider />
          <br />
          {newUsers.length > 0 && (
            <h3>
              Accounts for Upload{' '}
              <Button
                disabled={disabled}
                style={{ float: 'right' }}
                type='primary'
                onClick={() => this.uploadAccounts()}
              >
                Create Accounts
              </Button>
            </h3>
          )}
          <QueueAnim type={'left'} delay={[500, 0]}>
            {newUsers.length > 0 &&
              newUsers.map((user: ICompanyEmployee) => {
                return (
                  <List.Item
                    key={user.email}
                    style={{ textAlign: 'left' }}
                    className='fleet-list-item'
                  >
                    <List.Item.Meta
                      title={`${user.firstName} ${user.lastName}`}
                      description={`${user.email}`}
                    />
                    <Tag color='green'>{user.role}</Tag>
                  </List.Item>
                );
              })}
          </QueueAnim>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state: IRootState): any => ({
  companyInfo: state.company
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  updateCompanyEmployees: (value: ICompanyEmployee[]) => {
    dispatch({ type: 'UPDATE_COMPANY_EMPLOYEES', value });
  },
  setEditAccount: (value: ICompanyEmployee) => {
    dispatch({ type: 'SET_EDIT_ACCOUNT', value });
  }
});

export default compose<any, any>(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BulkImport);

import React, { Component } from 'react';
import { List, Tag, Card, Icon, Row, Divider } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import QueueAnim from 'rc-queue-anim';

import { withFirebase } from '../../../Firebase';
import { Dispatch } from 'redux';
import { IRootState, ICompanyInfo } from '../../../types/types';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { Link } from 'react-router-dom';

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
  bugReports: any[];
  activeRequestCounts: number;
  focusedRequest: {
    description: string;
    email: string;
    name: string;
    downloadUrl: string;
    timestamp: string;
  };
}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps & FormComponentProps;

class BugList extends Component<Props, State> {
  state = {
    bugReports: [],
    activeRequestCounts: 0,
    focusedRequest: {
      name: '',
      email: '',
      description: '',
      downloadUrl: '',
      timestamp: ''
    }
  };

  async componentDidMount() {
    const { firebase } = this.props;

    //@ts-ignore
    this.listenerRef = firebase
      .firestoreAccess()
      .collection('bugReports')
      .onSnapshot((querySnapshot: any) => {
        let bugReports: any[] = [];
        let activeRequestCounts = 0;
        querySnapshot.forEach((doc: any) => {
          bugReports.push(doc.data());
          if (doc.data().active) {
            activeRequestCounts += 1;
          }
        });
        this.setState({
          bugReports,
          activeRequestCounts
        });
      });
  }

  componentWillUnmount() {
    //@ts-ignore
    this.listenerRef();
  }

  handleSubmit = (e: any) => {
    const { firebase, history } = this.props;
    e.preventDefault();
    const { form } = this.props;
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (!err) {
        try {
          await firebase.doSignInWithEmailAndPassword(
            values.userName,
            values.password
          );
          history.push('/dashboard/home');
        } catch (error) {}
      }
    });
  };

  render() {
    const { bugReports, activeRequestCounts, focusedRequest } = this.state;
    return (
      activeRequestCounts > 0 && (
        <>
          <Card>
            <h2>Active Bugs</h2>
            <QueueAnim type={'left'} delay={[500, 0]}>
              {bugReports.length > 0 &&
                bugReports.map((request: any) => {
                  if (request.active) {
                    return (
                      <List.Item
                        key={request.description}
                        onClick={() =>
                          this.setState({ focusedRequest: request })
                        }
                        style={{ textAlign: 'left', cursor: 'pointer' }}
                        className=''
                      >
                        <List.Item.Meta
                          title={`${request.description &&
                            request.description.substr(0, 60)}... `}
                        />
                        <Tag color='green'>Active</Tag>
                      </List.Item>
                    );
                  }
                })}
            </QueueAnim>

            {focusedRequest.description !== '' ? (
              <Row>
                <Divider />
                <Tag color='blue'>Email: {focusedRequest.email}</Tag>
                <Tag color='blue'>Name: {focusedRequest.name}</Tag>
                <Tag color='green'>
                  {moment(focusedRequest.timestamp).format('MMM-DD-YYYY HH:mm')}
                </Tag>
                <br /> <br />
                <h4>{focusedRequest.description}</h4>
                {focusedRequest.downloadUrl && (
                  <p
                    style={{ cursor: 'pointer', marginBottom: 0 }}
                    onClick={() => window.open(focusedRequest.downloadUrl)}
                  >
                    <Link to={'/dashboard/home'}>
                      {' '}
                      <Icon type='file-protect' /> Link to File
                    </Link>
                  </p>
                )}
              </Row>
            ) : null}
          </Card>
        </>
      )
    );
  }
}

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
)(BugList);

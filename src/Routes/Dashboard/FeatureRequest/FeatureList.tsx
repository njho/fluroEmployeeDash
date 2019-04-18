import React, { Component } from 'react';
import { List, Tag, Card } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import QueueAnim from 'rc-queue-anim';

import { withFirebase } from '../../../Firebase';
import { Dispatch } from 'redux';
import { IRootState, ICompanyInfo } from '../../../types/types';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
import Item from 'antd/lib/list/Item';

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
  featureRequests: any[];
  activeRequestCounts: number;
  focusedRequest: { description: string; email: string; name: string };
}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps & FormComponentProps;

class FeatureList extends Component<Props, State> {
  state = {
    featureRequests: [],
    activeRequestCounts: 0,
    focusedRequest: {
      name: '',
      email: '',
      description: ''
    }
  };

  async componentDidMount() {
    const { firebase, companyInfo } = this.props;

    //@ts-ignore
    this.listenerRef = firebase
      .firestoreAccess()
      .collection('featureRequests')
      .onSnapshot((querySnapshot: any) => {
        let featureRequests: any[] = [];
        let activeRequestCounts = 0;
        querySnapshot.forEach((doc: any) => {
          featureRequests.push(doc.data());
          if (doc.data().active) {
            activeRequestCounts += 1;
          }
        });
        this.setState({
          featureRequests,
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
    const { featureRequests, activeRequestCounts, focusedRequest } = this.state;
    console.log(activeRequestCounts);
    return (
      activeRequestCounts > 0 && (
        <>
          <h2>Active Feature Requests</h2>
          <QueueAnim type={'left'} delay={[500, 0]}>
            {featureRequests.length > 0 &&
              featureRequests.map((request: any) => {
                if (request.active) {
                  return (
                    <List.Item
                      key={request.description}
                      onClick={() => this.setState({ focusedRequest: request })}
                      style={{ textAlign: 'left', cursor: 'pointer' }}
                      className='fleet-list-item'
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
          <br />
          {focusedRequest.description !== '' ? (
            <Card>
              <h4>{focusedRequest.description}</h4>
              <Tag>Email: {focusedRequest.email}</Tag>
              <Tag>Name: {focusedRequest.name}</Tag>
            </Card>
          ) : null}
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
)(FeatureList);

import React, { Component } from 'react';
import { List, Tag } from 'antd';
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

const featureRequests = [
  {
    name: 'Add additional information to...'
  },
  {
    name: 'Add this to the interface...'
  }
];

class FeatureList extends Component<Props, State> {
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
    const { form } = this.props;

    return (
      <QueueAnim type={'left'} delay={[500, 0]}>
        {featureRequests.length > 0 &&
          featureRequests.map((request: any) => {
            return (
              <List.Item
                key={request.name}
                style={{ textAlign: 'left' }}
                className='fleet-list-item'
              >
                <List.Item.Meta title={`${request.name} `} />
                <Tag color='green'>Active</Tag>
              </List.Item>
            );
          })}
      </QueueAnim>
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

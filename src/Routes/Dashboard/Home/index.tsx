import React, { Component } from 'react';
import { Row, Col, Card, Icon, Statistic } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';
import { compose } from 'recompose';

import { withFirebase } from '../../../Firebase';
import { any } from 'prop-types';
import { Dispatch } from 'redux';
import {
  IRootState,
  ICompanyInfo,
  ICompanyCreditCard,
  ICompanySubscription,
  ICompany
} from '../../../types/types';
import { IDoc } from '../../../types/firebaseTypes';
import { RouteComponentProps } from 'react-router';
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
  updateCompanyZones: (zones: any) => void;
  updateCompanyCC: (creditCards: ICompanyCreditCard[]) => void;
  updateCompanySubscription: (subscriptions: ICompanySubscription) => void;
  // setEditAccount: (employee: ICompanyEmployee) => void;
}
/**
 * Local State
 */
interface State {}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps;
class Home extends Component<Props, State> {
  async componentDidMount() {
    const { updateCompanySubscription, firebase, companyInfo } = this.props;

    this.fetchZones();
    this.fetchCreditCards();
    if (companyInfo.company.companyId) {
      let response = await firebase
        .companySubscription(companyInfo.company.companyId)
        .get();
      if (response.exists) {
        updateCompanySubscription(response.data());
      }
    }
  }

  async componentDidUpdate(prevProps: Props) {
    const { companyInfo, firebase, updateCompanySubscription } = this.props;
    if (
      prevProps.companyInfo.company.companyId !== companyInfo.company.companyId
    ) {
      this.fetchZones();
      this.fetchCreditCards();

      let response = await firebase
        .companySubscription(companyInfo.company.companyId)
        .get();

      if (response.exists) {
        updateCompanySubscription(response.data());
      }
    }
  }

  fetchZones = async () => {
    const { firebase, companyInfo, updateCompanyZones } = this.props;
    const zones: any[] = [];

    if (companyInfo.company.companyId) {
      const querySnapshot = await firebase
        .getCompanyZones(companyInfo.company.companyId)
        .onSnapshot((querySnapshot: any) => {
          /**
           * Save each `zone` inside the `zones` array.
           * We require an `index` counter to know when to update redux
           */
          let index = 0;
          querySnapshot.forEach((doc: IDoc<any>) => {
            zones.push({ ...doc.data(), docId: doc.id });
            index += 1;
            console.log({ index, length: querySnapshot.size });
            if (index === querySnapshot.size) {
              updateCompanyZones(zones);
            }
          });
          if (querySnapshot.size === 0) {
            updateCompanyZones([]);
          }
        });
    }
  };

  fetchCreditCards = async () => {
    const { firebase, companyInfo, updateCompanyCC } = this.props;
    const creditCards: ICompanyCreditCard[] = [];

    if (companyInfo.company.companyId) {
      await firebase
        .getCompanyCreditCards(companyInfo.company.companyId)
        .onSnapshot((querySnapshot: any) => {
          /**
           * Save each `creditCard` inside the `creditCards` array.
           * We require an `index` counter to know when to update redux
           */
          let index = 0;
          querySnapshot.forEach((doc: IDoc<any>) => {
            creditCards.push({ ...doc.data(), docId: doc.id });
            index += 1;
            console.log({ index, length: querySnapshot.size });
            if (index === querySnapshot.size) {
              updateCompanyCC(creditCards);
            }
          });
          if (querySnapshot.size === 0) {
            updateCompanyCC([]);
          }
        });
    }
  };

  render() {
    const { companyInfo } = this.props;
    console.log(this.props.companyInfo.company);
    return <></>;
  }
}

const mapStateToProps = (state: IRootState): any => ({
  companyInfo: state.company
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  updateCompanyZones: (value: any[]) => {
    dispatch({ type: 'UPDATE_COMPANY_ZONES', value });
  },
  updateCompanyCC: (value: ICompanyCreditCard[]) => {
    dispatch({ type: 'UPDATE_COMPANY_CREDIT_CARDS', value });
  },
  updateCompanySubscription: (value: ICompanySubscription) => {
    dispatch({ type: 'UPDATE_COMPANY_SUBSCRIPTION', value });
  }
});

export default compose<any, any>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withFirebase
)(Home);

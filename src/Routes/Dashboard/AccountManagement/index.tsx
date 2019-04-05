import React from 'react';
import { ChangeEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, List, Icon, Button, Tag } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFirebase } from '../../../Firebase';
import { Dispatch } from 'redux';
const ButtonGroup = Button.Group;

import './styles.scss';
import {
  ICompanyInfo,
  ICompanyEmployee,
  IRootState
} from './../../../types/types';
import { IDoc } from '../../../types/firebaseTypes';
import LimitForm from './LimitForm';
import { Divider } from 'antd';
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
interface State {}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps;

class AccountManagement extends React.Component<Props, State> {
  async componentDidMount() {
    const { firebase, companyInfo, updateCompanyEmployees } = this.props;
    let employees: ICompanyEmployee[] = [];

    if (companyInfo.company.companyId) {
      const querySnapshot = await firebase
        .getCompanyEmployees(companyInfo.company.companyId)
        .get();
      console.log('After await');

      /**
       * Save each `employee` inside the `employees` array.
       * We require an `index` counter to know when to update redux
       */
      let index = 0;
      querySnapshot.forEach((doc: IDoc<ICompanyEmployee>) => {
        employees.push({ ...doc.data(), docId: doc.id });
        index += 1;
        console.log({ index, length: querySnapshot.size });
        if (index === querySnapshot.size) {
          updateCompanyEmployees(employees);
        }
      });
    }
  }

  render() {
    const { history, companyInfo, setEditAccount } = this.props;
    return (
      <>
        <QueueAnim type={'left'} delay={[250, 0]}>
          <Row key='a'>
            <Col span={24}>
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                Set Account Limits
              </h3>
              <h4>
                Setting the account limit determines how many{' '}
                <b>fills or services</b> an employee account can receive on a
                monthly basis. <br />
                All effects come into effect in the next monthly cycle.
              </h4>
              <LimitForm />
              <span style={{ color: '#bbb' }}>
                {' '}
                Current limit set at: {companyInfo.company.subscriptionAmount}
              </span>
            </Col>
          </Row>
          <Divider />
          <Row key='b' style={{ marginTop: '30px' }}>
            <Col span={24}>
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                Accounts
                <div>
                  {' '}
                  <ButtonGroup>
                    <Button
                      type='primary'
                      onClick={() =>
                        history.push('/dashboard/accounts/bulkImport')
                      }
                    >
                      Import Bulk Accounts{' '}
                      <Icon type='copy' style={{ paddingLeft: '3px' }} />
                    </Button>
                    <Button
                      type='primary'
                      onClick={() =>
                        history.push('/dashboard/accounts/newAccount')
                      }
                    >
                      Add New Account
                      <Icon type='plus' style={{ paddingLeft: '3px' }} />
                    </Button>
                  </ButtonGroup>
                </div>{' '}
              </h3>
              <h4>Add and remove employee accounts.</h4>

              {companyInfo.employees.length > 0 &&
                companyInfo.employees.map(item => {
                  if (item.isPartOfCompany) {
                    return (
                      <List.Item
                        key={item.docId}
                        style={{ textAlign: 'left' }}
                        className='fleet-list-item'
                        onClick={() => {
                          setEditAccount(item);
                          history.push(
                            `/dashboard/accounts/editAccount/${item.docId}`
                          );
                        }}
                      >
                        <List.Item.Meta title={item.displayName} />
                        <Tag color='green'>{item.role}</Tag>
                      </List.Item>
                    );
                  }
                  return null;
                })}
            </Col>
          </Row>
        </QueueAnim>
      </>
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
)(AccountManagement);

import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFirebase } from '../../../Firebase';
import { Row, Col, List, Icon, Button, Select } from 'antd';
import QueueAnim from 'rc-queue-anim';
import './styles.scss';
import {
  ICompanyInfo,
  IRootState,
  IZoneVehicle,
  ICompanyVehicle
} from '../../../types/types';
import { IDoc } from '../../../types/firebaseTypes';
import { Dispatch } from 'redux';

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
  updateEditVehicle: (vehicle: ICompanyVehicle) => void;
  updateCompanyVehicles: (vehicles: IZoneVehicle[]) => void;
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
class FleetManagement extends Component<Props, State> {
  componentDidMount() {
    this.fetchVehicles();
  }

  async componentDidUpdate(prevProps: Props) {
    const { companyInfo } = this.props;
    if (
      prevProps.companyInfo.company.companyId !== companyInfo.company.companyId
    ) {
      this.fetchVehicles();
    }
  }

  fetchVehicles = async () => {
    const { firebase, companyInfo, updateCompanyVehicles } = this.props;
    const vehicles: IZoneVehicle[] = [];

    if (companyInfo.company.companyId) {
      console.log('Grabbing the vehicles');
      firebase
        .getCompanyVehicles(companyInfo.company.companyId)
        .onSnapshot(function(querySnapshot: any) {
          /**
           * Save each `zone` inside the `zones` array.
           * We require an `index` counter to know when to update redux
           */
          let index = 0;
          querySnapshot.forEach((doc: IDoc<any>) => {
            console.log('received a vehicle');
            vehicles.push({ ...doc.data(), docId: doc.id });
            index += 1;
            console.log({ index, length: querySnapshot.size });
            if (index === querySnapshot.size) {
              updateCompanyVehicles(vehicles);
            }
          });
          if (querySnapshot.size === 0) {
            updateCompanyVehicles([]);
          }
        });
    }
  };

  render() {
    const { history, companyInfo, updateEditVehicle } = this.props;
    console.log(companyInfo.zones);
    return (
      <Row>
        <Col span={24}>
          <h3
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            Fleet Vehicles
            <Button
              style={{ float: 'right' }}
              type='primary'
              onClick={() => {
                history.push('/dashboard/fleet/newVehicle');
              }}
              className='login-form-button'
            >
              Add New Vehicle
              <Icon type='plus' style={{ paddingLeft: '3px' }} />
            </Button>{' '}
          </h3>
          <h4>
            Fleet vehicles are serviced as per the schedule, and will be billed
            automatically.
            <br />
            These should not be associated with employee accounts.
          </h4>

          <QueueAnim type='left' delay={[250, 0]}>
            {companyInfo.vehicles.map(item => (
              <List.Item
                key={item.docId}
                style={{ textAlign: 'left' }}
                className='fleet-list-item'
                onClick={() => {
                  updateEditVehicle(item);
                  history.push(`/dashboard/fleet/editVehicle/${item.docId}`);
                }}
              >
                <List.Item.Meta
                  title={`License: ${item.license} Make: ${item.make}`}
                />
              </List.Item>
            ))}
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
  updateEditVehicle: (value: any[]) => {
    dispatch({ type: 'SET_EDIT_VEHICLE', value });
  },
  updateCompanyVehicles: (value: any[]) => {
    dispatch({ type: 'UPDATE_COMPANY_VEHICLES', value });
  }
});

export default compose<any, any>(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FleetManagement);

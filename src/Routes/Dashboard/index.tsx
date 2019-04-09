import React, { Component, Dispatch } from 'react';
import { Row, Col, Icon } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import SideMenu from '../../Components/SideMenu';

import FleetManagement from './FleetManagement';
import AddVehicle from './FleetManagement/AddVehicle';
import EditVehicle from './FleetManagement/EditVehicle';

import Home from './Home';

import AccountManagement from './AccountManagement';
import AddAccount from './AccountManagement/AddAccount';
import EditAccount from './AccountManagement/EditAccount';
import BulkImport from './AccountManagement/BulkImport';

import { withFirebase } from '../../Firebase';
import { AuthUserContext, withAuthorization } from '../../Session';

import { ICompanyInfo } from './../../types/types';
import { any } from 'prop-types';
import { IAuthUser, IDoc } from './../../types/firebaseTypes';
import DrawerComponent from '../../Components/DrawerComponent';

/**
 * OwnProps is passed down from the Parent
 */
interface OwnProps
  extends RouteComponentProps<{
    dashboardLocation: string;
    subRoute: string;
    identifier: string;
  }> {}
/**
 * Dispatched State from Redux
 */
interface StateProps {
  firebase: any;
}
/**
 * Dispatched Props from Redux
 */
interface DispatchProps {
  updateCompanyInformation: (companyInformation: ICompanyInfo) => void;
}
/**
 * Local State
 */
interface State {
  visible: boolean;
}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps;

class Dashboard extends Component<Props, State> {
  state = {
    visible: false
  };
  dashRouter = (location: string, subRoute: string, identifier: string) => {
    switch (location) {
      case 'home':
        return <Home />;
      case 'accounts':
        if (subRoute === 'newAccount') {
          return <AddAccount />;
        }
        if (subRoute === 'editAccount') {
          return <EditAccount />;
        }
        if (subRoute === 'bulkImport') {
          return <BulkImport />;
        }
        return <AccountManagement />;
      case 'fleet':
        if (subRoute === 'newVehicle') {
          return <AddVehicle />;
        }
        if (subRoute === 'editVehicle') {
          return <EditVehicle />;
        }
        return <FleetManagement />;

      default:
        return null;
    }
  };

  toggle = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible
    });
  };

  render() {
    const {
      match: {
        params: { dashboardLocation, subRoute, identifier }
      }
    } = this.props;
    return (
      <div className='dashboard-container'>
        <Row type='flex' className='dashboard-container'>
          <Icon
            onClick={() => this.toggle()}
            className='mobile-display menu-icon'
            type='menu'
          />
          <Col xs={{ span: 0 }} md={{ span: 5, offset: 0 }}>
            <SideMenu />
          </Col>
          <Col
            xs={{ span: 22, offset: 1 }}
            md={{ span: 16 }}
            className='page-container'
          >
            {this.dashRouter(dashboardLocation, subRoute, identifier)}
          </Col>
        </Row>
        <DrawerComponent
          visible={this.state.visible}
          onClose={() => this.toggle()}
        />
      </div>
    );
  }
}

Dashboard.contextType = AuthUserContext;

/**
 * This is the condition that sets the authentication state and route authorization on the Dashboard
 */
const condition = (authUser: IAuthUser) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  updateCompanyInformation: (value: ICompanyInfo) => {
    dispatch({ type: 'UPDATE_COMPANY_INFORMATION', value });
  }
});

export default compose<any, any>(
  withRouter,
  withFirebase,
  withAuthorization(condition),
  connect(
    null,
    mapDispatchToProps
  )
)(Dashboard);

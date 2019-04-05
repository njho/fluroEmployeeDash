import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';

import './styles.scss';

class DrawerMenu extends Component {
  navigateTo(location) {
    const { history } = this.props;
    history.push(`${location}`);
  }

  render() {
    const { onClose, firebase } = this.props;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div className='bottom-drawer-container'>
            <Link onClick={() => onClose()} to='/dashboard/home'>
              <div className='bottom-drawer-item no-select'>Home</div>
            </Link>{' '}
            <Link onClick={() => onClose()} to='/dashboard/zones'>
              <div className='bottom-drawer-item no-select'>
                Scheduling & Zoning
              </div>
            </Link>
            <Link onClick={() => onClose()} to='/dashboard/fleet'>
              <div className='bottom-drawer-item no-select'>
                Fleet Management{' '}
              </div>
            </Link>
            <Link onClick={() => onClose()} to='/dashboard/accounts'>
              <div className='bottom-drawer-item no-select'>
                {' '}
                Account Management
              </div>
            </Link>
            <Link onClick={() => onClose()} to='/dashboard/payment'>
              <div className='bottom-drawer-item no-select'>
                Payment Information
              </div>
            </Link>
            <Link
              to='/'
              onClick={() => {
                onClose();
                firebase.doSignOut();
              }}
            >
              <div className='bottom-drawer-item no-select'> Logout</div>
            </Link>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(DrawerMenu);

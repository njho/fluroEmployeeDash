import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { Icon } from 'antd';

import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';

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
              <div className='bottom-drawer-item no-select'>
                <Icon type='security-scan' />
                Submit A Bug Report
              </div>
            </Link>{' '}
            <Link onClick={() => onClose()} to='/dashboard/home'>
              <div className='bottom-drawer-item no-select'>
                <Icon type='audit' />
                Request A Feature
              </div>
            </Link>
            <Link onClick={() => onClose()} to='/dashboard/home'>
              <div className='bottom-drawer-item no-select'>
                <Icon type='read' /> Review Documentation
              </div>
            </Link>
            <Link onClick={() => onClose()} to='/dashboard/home'>
              <div className='bottom-drawer-item no-select'>
                <Icon type='github' /> Github
              </div>
            </Link>
            <Link
              to='/'
              onClick={() => {
                onClose();
                firebase.doSignOut();
              }}
            >
              <div className='bottom-drawer-item no-select'>
                <Icon type='logout' />
                Logout
              </div>
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

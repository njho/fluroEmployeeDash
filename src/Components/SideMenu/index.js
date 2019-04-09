import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Icon } from 'antd';
import { compose } from 'recompose';
import { AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';

class SideMenu extends Component {
  navigateTo(location) {
    const { history } = this.props;
    history.push(`${location}`);
  }

  render() {
    const { firebase } = this.props;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div className='side-menu-container'>
            <Link to='/dashboard/home'>
              <div className='side-menu-item no-select'>
                <Icon type='security-scan' />
                Submit A Bug Report
              </div>
            </Link>
            <Link to='/dashboard/home'>
              <div className='side-menu-item no-select'>
                <Icon type='audit' />
                Request A Feature
              </div>
            </Link>
            <Link to='/dashboard/home'>
              <div className='side-menu-item no-select'>
                <Icon type='read' /> Review Documentation
              </div>
            </Link>
            <div
              onClick={() => window.open('https://github.com/Flurotech/')}
              className='side-menu-item no-select'
            >
              <Icon type='github' /> Github
            </div>
            <div
              className='side-menu-item no-select'
              onClick={() => {
                firebase.doSignOut();
              }}
            >
              <Icon type='logout' />
              Logout
            </div>
            <div className='premium-container'>
              <Icon
                type='crown'
                style={{
                  color: '#3d3f42',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              />
              <div className='premium-title'>Premium</div>
              Contact us for access to advanced analytic features.
              <div className='premium-button'>Subscribe</div>
            </div>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(SideMenu);

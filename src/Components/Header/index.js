import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';

class Header extends Component {
  render() {
    const { onToggle, firebase } = this.props;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div className='menu-container'>
            <Menu mode='horizontal' className='menu'>
              <Menu.Item key='mail' className='menu-item no-select'>
                <Icon type='car' />{' '}
                <Link to={authUser ? '/dashboard/home' : '/'}>Home</Link>{' '}
              </Menu.Item>
            </Menu>
            <div>
              {authUser ? (
                <Icon
                  onClick={() => onToggle()}
                  className='mobile-display menu-icon'
                  type='menu'
                />
              ) : null}
              {authUser ? (
                <div className='menu-right-item no-select mobile-no-display'>
                  <Link
                    to='/'
                    onClick={() => {
                      firebase.doSignOut();
                    }}
                  >
                    Logout
                  </Link>
                </div>
              ) : null}
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
)(Header);

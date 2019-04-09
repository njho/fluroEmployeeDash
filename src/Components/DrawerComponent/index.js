import React, { Component } from 'react';
import { Drawer } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { AuthUserContext } from '../../Session';
import DrawerMenu from '../DrawerMenu';

class DrawerComponent extends Component {
  render() {
    const { onClose, visible } = this.props;
    return (
      <AuthUserContext.Consumer>
        {() => (
          <Drawer
            height='100%'
            placement='bottom'
            visible={visible}
            closable
            onClose={() => onClose()}
          >
            <DrawerMenu onClose={() => onClose()} />
          </Drawer>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default compose(withRouter)(DrawerComponent);

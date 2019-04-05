// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './Components/Header';
import DrawerComponent from './Components/DrawerComponent';

class Layout extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: false
    });
  };

  toggle = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible
    });
  };

  render() {
    const { children } = this.props;
    const { visible } = this.state;

    return (
      <div className='app-container'>
        {/* <Header onToggle={() => this.toggle()} /> */}
        <div className='main-container'> {children}</div>
        <DrawerComponent visible={visible} onClose={() => this.toggle()} />
      </div>
    );
  }
}

export default withRouter(
  connect(
    null,
    null
  )(Layout)
);

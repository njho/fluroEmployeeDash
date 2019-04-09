// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

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

    return (
      <div className='app-container'>
        <div className='main-container'> {children}</div>
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

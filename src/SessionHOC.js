// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthentication } from './Session';

/**
 * The SessionHOC
 */
class SessionHOC extends React.Component {
  render() {
    const { children } = this.props;
    // const { authUser } = this.state;
    return <>{children}</>;
  }
}

export default compose(
  withRouter,
  withAuthentication
)(SessionHOC);

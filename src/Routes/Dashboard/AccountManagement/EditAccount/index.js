import React, { Component } from 'react';
import { Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import EditAccountForm from './EditAccountForm';
// import { matchType } from '../../../../Helpers/types.ts';

// type Props = {
//   // match: matchType
// };

class EditAccount extends Component {
  render() {
    const { companyInfo, match } = this.props;
    console.log({ match });
    return (
      <Row>
        <Col span={24}>
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            Edit This Account
          </h2>
          <QueueAnim type={['left']} delay={[500, 0]}>
            <EditAccountForm companyInfo={companyInfo} key='a' />
          </QueueAnim>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  companyInfo: state.company
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    null
  )
)(EditAccount);

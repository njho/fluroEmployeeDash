import React, { Component } from 'react';
import { Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux';
import NewAccountForm from './NewAccountForm';

class AddAccountForm extends Component {
  render() {
    const { companyInfo } = this.props;
    console.log(companyInfo);
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
            Create an Account
          </h2>
          <h4>
            Create account holders within{' '}
            {companyInfo.name === null ? 'your company' : companyInfo.name}.
          </h4>
          <QueueAnim type={['left']} delay={[500, 0]}>
            <NewAccountForm companyInfo={companyInfo} key='a' />
          </QueueAnim>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  companyInfo: state.company
});

export default connect(
  mapStateToProps,
  null
)(AddAccountForm);

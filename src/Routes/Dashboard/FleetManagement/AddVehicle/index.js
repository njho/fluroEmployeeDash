import React, { Component } from 'react';
import { Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import VehicleForm from '../VehicleForm';

class AddAccountForm extends Component {
  render() {
    return (
      <Row>
        <Col span={24}>
          <QueueAnim type={['left']} delay={[500, 0]}>
            <VehicleForm key='a' />
          </QueueAnim>
        </Col>
      </Row>
    );
  }
}

export default AddAccountForm;

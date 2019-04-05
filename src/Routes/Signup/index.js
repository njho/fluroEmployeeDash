import React, { Component } from 'react';
import { Row, Col } from 'antd';
import SignupForm from './SignupForm';

const office = require('../../Assets/office.jpeg');

class Signup extends Component {
  state = {};

  render() {
    return (
      <>
        <Row>
          <div className='contact-us-block' />
          <div className='sign-up-vertical-block' />

          <Col
            xs={{ span: 20, offset: 2 }}
            lg={{ span: 9, offset: 2 }}
            className='sign-up-column'
          >
            <h1>Sign Up</h1>
            <h3>Express interest in working with Sure Fuel.</h3>
            <h4>
              Our corporate dashboard provides the insights to manage your
              fleet, and orders effectively.
              <br />
              Please reach out to us and we{"'"}ll be in contact with you
              shortly.
            </h4>

            <SignupForm key='a' />
          </Col>
          <Col xs={{ span: 20, offset: 2 }} lg={{ span: 9, offset: 2 }}>
            {' '}
            <img src={office} alt='' className='sign-up-image' />
          </Col>
        </Row>
      </>
    );
  }
}

export default Signup;

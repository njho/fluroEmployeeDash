import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import './Public.scss';
import QueueAnim from 'rc-queue-anim';
import Login from './Login';
import { UNSPLASH_WEED } from '../../Constants';

class Public extends Component {
  state = {
    unsplashImageIndex: ''
  };

  componentDidMount() {
    const index = Math.floor(Math.random() * UNSPLASH_WEED.length);
    this.setState({
      unsplashImageIndex: index,
      loginVisible: false
    });
  }

  render() {
    const { unsplashImageIndex, loginVisible } = this.state;
    return (
      <div
        className='App'
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundImage: `url(${UNSPLASH_WEED[unsplashImageIndex]})`
        }}
      >
        <Row type='flex' align='middle' style={{ height: '100vh' }}>
          <Col xs={{ span: 0, offset: 0 }} lg={{ span: 9, offset: 0 }} />
          <Col
            xs={{ span: 20, offset: 2 }}
            lg={{ span: 6, offset: 0 }}
            className='login-column'
          >
            <QueueAnim type='bottom' delay={[500]}>
              {loginVisible && <Login key='a' />}
            </QueueAnim>
          </Col>
          <Col xs={{ span: 0, offset: 0 }} lg={{ span: 9, offset: 0 }} />
        </Row>
        {!loginVisible && (
          <div
            onClick={() => {
              this.setState({
                loginVisible: true
              });
            }}
            className='pulsating-circle'
          />
        )}
      </div>
    );
  }
}

export default Public;

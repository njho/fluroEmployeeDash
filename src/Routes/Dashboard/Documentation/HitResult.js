import React, { Component } from 'react';
import { Input, List, Col, Row, Card } from 'antd';
import QueueAnim from 'rc-queue-anim';

import { connectHits } from 'react-instantsearch-dom';

const Hits = props => {
  console.log(props.hits);
  return (
    <Row>
      <Col span={24}>
        <QueueAnim type={['left']} delay={[500, 0]}>
          {props.hits.map((item, index) => (
            <Col
              xs={{ span: 24 }}
              lg={{ span: 10 }}
              style={{ cursor: 'pointer', paddingRight: '10px' }}
              key={item.objectID}
              onClick={() => window.open(item.downloadUrl)}
            >
              <Card>
                <h4>{item.title}</h4>
                {item.description}
              </Card>
            </Col>
          ))}
        </QueueAnim>
      </Col>
    </Row>
  );
};
const CustomHits = connectHits(Hits);

export default CustomHits;

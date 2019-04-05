import React, { Component } from 'react';
import { Row, Col, Card, List, Icon } from 'antd';
import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';

class SearchResults extends Component {
  render() {
    const {
      results,
      callback,
      titleKey,
      descriptionKey,
      clearSearch
    } = this.props;
    console.log(results);
    return results.length > 0 ? (
      <Row>
        <h3>
          Search Results{' '}
          <div
            style={{
              position: 'absolute',
              right: '10px',
              top: 0,
              cursor: 'pointer'
            }}
          >
            <Icon
              onClick={() => clearSearch()}
              style={{ fontSize: '12px' }}
              type='close'
            />
          </div>
        </h3>
        <Card style={{ width: '100%', margin: '20px 0' }}>
          <Row>
            <Col>
              <QueueAnim type={['left']} delay={[500, 0]}>
                {results.map((item, index) => (
                  <List.Item
                    key={item.id}
                    style={{ textAlign: 'left' }}
                    className='fleet-list-item'
                    onClick={() => {
                      console.log(item);
                      callback(item[titleKey], item.id, item.name);
                      clearSearch();
                    }}
                  >
                    <List.Item.Meta
                      title={item[titleKey]}
                      description={item[descriptionKey]}
                    />
                  </List.Item>
                ))}
              </QueueAnim>
            </Col>
          </Row>
        </Card>
      </Row>
    ) : null;
  }
}

const mapStateToProps = state => ({
  companyInfo: state.company
});

const mapDispatchToProps = dispatch => ({
  updateCompanyEmployees: value => {
    dispatch({ type: 'UPDATE_COMPANY_EMPLOYEES', value });
  },
  setEditAccount: value => {
    dispatch({ type: 'SET_EDIT_ACCOUNT', value });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults);

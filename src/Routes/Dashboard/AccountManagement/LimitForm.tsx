import React, { Component } from 'react';
import {
  Form,
  Icon,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  notification
} from 'antd';
import { connect } from 'react-redux';
import { withFirebase } from '../../../Firebase';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { FormComponentProps } from 'antd/lib/form';
import { ICompanyInfo, IRootState } from '../../../types/types';
import { Dispatch } from 'redux';
import { compose } from 'recompose';

const { Option } = Select;
const FormItem = Form.Item;

/**
 * OwnProps is passed down from the Parent
 */
interface OwnProps extends RouteComponentProps {}
/**
 * Dispatched State from Redux
 */
interface StateProps {
  firebase: any;
  companyInfo: ICompanyInfo;
  match: any;
}
/**
 * Dispatched Props from Redux
 */
interface DispatchProps {
  updateCompanyInformation: (companyInformation: ICompanyInfo) => void;
  // setEditAccount: (employee: ICompanyEmployee) => void;
}
/**
 * Local State
 */
interface State {}
/**
 * Combined props
 */

type Props = OwnProps & DispatchProps & StateProps & FormComponentProps;

class LimitForm extends Component<Props, State> {
  state = { number: 0 };

  failureNotification = () => {
    notification.error({
      message: 'An error occured.',
      description: 'Please try again.'
    });
  };

  successNotification = () => {
    notification.success({
      message: 'Successfully updated subscription',
      description: 'This will come into effect in the next cycle.'
    });
  };

  onSubmit = () => {
    const {
      form,
      companyInfo,
      firebase,
      updateCompanyInformation,
      match: {
        params: { subRoute, identifier }
      }
    } = this.props;
    const { validateFields } = form;

    validateFields(async (err: any, values: any) => {
      if (err) {
      } else {
        firebase.companyInformation(companyInfo.company.companyId).set(
          {
            subscriptionAmount: values.amount
          },
          { merge: true }
        );

        let response = await firebase
          .companyInformation(companyInfo.company.companyId)
          .get();

        if (response.exists) {
          updateCompanyInformation(response.data());
          this.successNotification();
        }

        form.resetFields();
      }
    });
  };

  handleNumberChange = (e: any) => {
    if (Number.isNaN(e)) {
      return;
    }
    this.props.form.setFieldsValue({
      amount: e
    });
  };

  render() {
    const { form } = this.props;
    const { number } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Form>
        <QueueAnim type='bottom'>
          <Row>
            <Col xs={{ span: 20 }} lg={{ span: 6 }}>
              <Form.Item
                style={{
                  width: '100%',
                  display: 'inline-block'
                }}
              >
                {getFieldDecorator('amount', {
                  rules: [
                    {
                      required: true,
                      message: 'Please provide a billing amount.',
                      type: 'number'
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    autoComplete='false'
                    onChange={this.handleNumberChange}
                    name='amount'
                    precision={0}
                    placeholder='Fills/Month'
                    // @ts-ignore
                    prefix={
                      <Icon
                        type='dollar'
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                  />
                )}
              </Form.Item>
            </Col>

            <Col xs={{ span: 20 }} lg={{ span: 6, offset: 1 }}>
              <Form.Item
                style={{
                  display: 'inline-block',
                  width: '100%'
                }}
              >
                {getFieldDecorator('cycle', {
                  rules: [
                    {
                      required: true,
                      message: 'Please provide a billing cycle.'
                    }
                  ]
                })(
                  <Select placeholder='Billing Cycle'>
                    <Option value='monthly'>Monthly</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col xs={{ span: 20 }} lg={{ span: 6, offset: 1 }}>
              <Form.Item
                style={{
                  display: 'inline-block',
                  width: '100%'
                }}
              >
                <Button onClick={() => this.onSubmit()} type='ghost'>
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </QueueAnim>
      </Form>
    );
  }
}

const LimitFormComponent = Form.create({ name: 'horizontal_login' })(LimitForm);

const mapStateToProps = (state: IRootState): any => ({
  companyInfo: state.company
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateCompanyInformation: (value: ICompanyInfo) => {
    dispatch({ type: 'UPDATE_COMPANY_INFORMATION', value });
  }
});

export default compose<any, any>(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LimitFormComponent);

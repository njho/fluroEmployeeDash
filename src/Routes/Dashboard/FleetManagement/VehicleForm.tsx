import React, { Component } from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Popconfirm } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../../Firebase';
import { IRootState, ICompanyInfo, IZoneVehicle } from '../../../types/types';
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/lib/form/Form';
import { IDoc } from '../../../types/firebaseTypes';
import { Dispatch } from 'redux';
import { findDOMNode } from 'react-dom';

const { Option } = Select;

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
  editVehicle: IZoneVehicle;
  match: any;
}
/**
 * Dispatched Props from Redux
 */
interface DispatchProps {
  setEditVehicle: (vehicle: IZoneVehicle) => void;
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

class VehicleFormComponent extends Component<Props, State> {
  componentDidMount() {
    const {
      form,
      editVehicle,
      match: {
        params: { subRoute }
      }
    } = this.props;

    /**
     * Determine if this is a `daily` delivery schedule.
     * If it matches, we alter the form.
     */
    if (subRoute !== 'newVehicle') {
      console.log(editVehicle);
      setTimeout(() => {
        Object.keys(editVehicle).forEach((key: string) => {
          console.log(key);
          form.setFieldsValue({
            // @ts-ignore
            [key]: editVehicle[key]
          });
        });
      }, 100);
    }
  }

  onSubmit = () => {
    const {
      form,
      editVehicle,
      companyInfo,
      firebase,
      history,
      match: {
        params: { subRoute, identifier }
      },
      setEditVehicle
    } = this.props;
    const { validateFields } = form;

    validateFields((err: any, values: any) => {
      if (err) {
      } else {
        console.log({ values });
        /**
         * We must find the object inside of our `zones` array which has the zoneID
         * corresponding to the zone we want.
         * This way we can append this to our vehicle object
         */

        let vehicleObject: any = {
          zoneName: companyInfo.zones.findIndex(
            element => element.docId === values.zoneId
          )
        };

        Object.keys(values).forEach(key => {
          vehicleObject[key] = values[key];
        });

        if (subRoute === 'newVehicle') {
          firebase.saveNewVehicle(companyInfo.company.companyId, vehicleObject);
        } else {
          firebase
            .vehicleUpdate(companyInfo.company.companyId, identifier)
            .set(vehicleObject);
        }
        history.push('/dashboard/fleet');
        setEditVehicle({
          license: '',
          make: '',
          model: '',
          color: '',
          zoneName: '',
          zoneId: ''
        });
      }
    });
  };

  deleteVehicle = () => {
    const {
      setEditVehicle,
      companyInfo,
      editVehicle,
      firebase,
      match: {
        params: { identifier }
      },
      history
    } = this.props;

    firebase.vehicleUpdate(companyInfo.company.companyId, identifier).delete();

    setEditVehicle({
      license: '',
      make: '',
      model: '',
      color: '',
      zoneName: '',
      zoneId: ''
    });
    history.push('/dashboard/fleet');
  };

  render() {
    const {
      companyInfo,
      match: {
        params: { subRoute }
      },
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form>
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 23, offset: 0 }}>
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              Vehicle Information{' '}
            </h3>
          </Col>
        </Row>
        <Row style={{ width: '100%' }}>
          <Col xs={{ span: 24 }} lg={{ span: 24, offset: 0 }}>
            <Row style={{ width: '100%' }}>
              <Col xs={{ span: 24, offset: 0 }} lg={{ span: 5, offset: 0 }}>
                <Form.Item
                  key='a'
                  style={{
                    width: '100%',
                    marginBottom: '12px'
                  }}
                >
                  {getFieldDecorator('license', {
                    rules: [
                      {
                        required: true,
                        message: 'Please provide your vehicle license.'
                      }
                    ]
                  })(
                    <Input
                      autoComplete='off'
                      name='email'
                      type='email'
                      prefix={
                        <Icon
                          type='car'
                          style={{
                            width: '100%',
                            color: 'rgba(0,0,0,.25)'
                          }}
                        />
                      }
                      placeholder='License Plate'
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={{ span: 24, offset: 0 }} lg={{ span: 5, offset: 1 }}>
                <Form.Item
                  key='a'
                  style={{
                    width: '100%',
                    marginBottom: '12px'
                  }}
                >
                  {getFieldDecorator('make', {
                    rules: [
                      {
                        required: true,
                        message: 'Please provide your vehicle make.'
                      }
                    ]
                  })(
                    <Input autoComplete='off' name='make' placeholder='Make' />
                  )}
                </Form.Item>
              </Col>
              <Col xs={{ span: 24, offset: 0 }} lg={{ span: 5, offset: 1 }}>
                <Form.Item
                  key='a'
                  style={{
                    width: '100%',
                    marginBottom: '12px'
                  }}
                >
                  {getFieldDecorator('model', {
                    rules: [
                      {
                        required: true,
                        message: 'Please provide your vehicle model.'
                      }
                    ]
                  })(
                    <Input
                      autoComplete='off'
                      name='model'
                      placeholder='Model'
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={{ span: 24, offset: 0 }} lg={{ span: 5, offset: 1 }}>
                <Form.Item
                  key='a'
                  style={{
                    width: '100%',
                    marginBottom: '12px'
                  }}
                >
                  {getFieldDecorator('color', {
                    rules: [
                      {
                        required: true,
                        message: 'Please provide your vehicle color.'
                      }
                    ]
                  })(
                    <Input
                      autoComplete='off'
                      name='color'
                      style={{ width: '100%' }}
                      placeholder='Color'
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <h4>Which zone this vehicle will be parked in?</h4>
        <Row>
          <Col xs={{ span: 24, offset: 0 }} lg={{ span: 5 }}>
            <Form.Item
              key='a'
              style={{
                width: '100%',
                marginBottom: '12px'
              }}
            >
              {getFieldDecorator('zoneName', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an applicable zone'
                  }
                ]
              })(
                <Select placeholder='Filling zone'>
                  {companyInfo.zones.map(item => (
                    <Option key={item.docId} value={item.docId}>
                      {item.zoneName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        {companyInfo.zones.length === 0 ? (
          <span style={{ color: '#ff7875' }}>
            A zone needs to be created prior to continuing.
          </span>
        ) : null}

        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 23, offset: 0 }}>
            <Form.Item key='c' style={{ float: 'right', marginRight: '15px' }}>
              <Button
                disabled={companyInfo.zones.length === 0}
                type='primary'
                // htmlType='submit'
                onClick={() => this.onSubmit()}
              >
                Submit
              </Button>
            </Form.Item>
            {subRoute !== 'newVehicle' ? (
              <Form.Item
                key='poo'
                style={{ float: 'right', marginRight: '10px' }}
              >
                <Popconfirm
                  title={'Delete Vehicle?'}
                  onConfirm={() => this.deleteVehicle()}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button type='danger'>Delete</Button>{' '}
                </Popconfirm>
              </Form.Item>
            ) : null}
          </Col>
        </Row>
      </Form>
    );
  }
}

const LoginForm = Form.create<any>({ name: 'horizontal_login' })(
  VehicleFormComponent
);

const mapStateToProps = (state: IRootState): any => ({
  companyInfo: state.company,
  editVehicle: state.editors.editVehicle
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setEditVehicle: (value: IZoneVehicle) => {
    dispatch({ type: 'SET_EDIT_VEHICLE', value });
  }
});

export default compose<any, any>(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LoginForm);

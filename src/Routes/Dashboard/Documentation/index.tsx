import React, { Component } from 'react';
import { Form, Button, Icon, Input, Upload, message, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../../Firebase';
import { Dispatch } from 'redux';
import { IRootState, ICompanyInfo } from '../../../types/types';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
import DocumentationSearch from './DocumentationSearch';
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
}
/**
 * Dispatched Props from Redux
 */
interface DispatchProps {}
/**
 * Local State
 */
interface State {}
/**
 * Combined props
 */
type Props = OwnProps & DispatchProps & StateProps & FormComponentProps;

class Documentation extends Component<Props, State> {
  handleSubmit = (e: any) => {
    const { firebase, history } = this.props;
    console.log('asdfasdf');
    e.preventDefault();
    const { form } = this.props;
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (!err) {
        try {
          console.log('in the try');
          await firebase.doSignInWithEmailAndPassword(
            values.userName,
            values.password
          );
          history.push('/dashboard/home');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  render() {
    const { form } = this.props;

    return (
      <div className='home-container'>
        <h1>FluroTech Documentation Search</h1>
        <h3>
          You can find all public FluroTech documentation and associated user
          manuals here.
        </h3>
        <DocumentationSearch />
        <br />
      </div>
    );
  }
}

const mapStateToProps = (state: IRootState): any => ({
  companyInfo: state.company
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({});

export default compose<any, any>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withFirebase
)(Documentation);

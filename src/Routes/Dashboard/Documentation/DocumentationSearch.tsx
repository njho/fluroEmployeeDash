import React, { Component } from 'react';
import { Input, Row, Col } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from '../../../Firebase';
import { compose } from 'recompose';
import { IRootState, ICompanyInfo } from '../../../types/types';
import { IDoc } from '../../../types/firebaseTypes';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
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

const { TextArea } = Input;

class DocumentationSearch extends Component<Props, State> {
  render() {
    const { form } = this.props;

    return (
      <div className='home-container'>
        <Input addonBefore='Search by Title, ID, or Description' />
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
)(DocumentationSearch);

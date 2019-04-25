import React, { Component } from 'react';
import { Input, List, Col } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from '../../../Firebase';
import { compose } from 'recompose';
import { IRootState } from '../../../types/types';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import CustomHits from './HitResult';

/**
 * OwnProps is passed down from the Parent
 */
interface OwnProps extends RouteComponentProps {}
/**
 * Dispatched State from Redux
 */
interface StateProps {
  firebase: any;
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
        <InstantSearch
          apiKey='57e1312f4aa7cf8e2b54b3ddb323fe03'
          appId='F2NFPNAZVH'
          indexName='documents'
        >
          <SearchBox
            translations={{ placeholder: 'Search by Title or Description' }}
          />
          <br />
          <CustomHits />
        </InstantSearch>
      </div>
    );
  }
}

const mapStateToProps = (state: IRootState): any => ({});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({});

export default compose<any, any>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withFirebase
)(DocumentationSearch);

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

import DetailsTitle from './details-title';

import ResourcesActionCreators from '../../actions/resources-action-creators';

class DetailsResource extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const entity = this.props.entity;
    const resource = this.props.resource;
    const refreshAction = () => console.trace('TODO');

    return (
      <div>
        <DetailsTitle
          center={
            <div>
              {resource}
              &nbsp;
              <mui.IconButton tooltip="refresh" onTouchTap={refreshAction}>
                <base.icons.actions.Refresh />
              </mui.IconButton>
            </div>
          }
          left={
            <div>
              <base.icons.Resource />
              &nbsp;
              Resource
            </div>
          }/>
      </div>
    );

    return (
      <h2>{resource}</h2>
    );
  }
}

DetailsResource.propTypes = {
  entity: React.PropTypes.object.isRequired,
  resource: React.PropTypes.string.isRequired,
};

export default DetailsResource;
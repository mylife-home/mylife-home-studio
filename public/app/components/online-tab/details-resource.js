'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';
import MainTitle from '../main-title';

import DetailsContainer from './details-container';

const DetailsResource = ({ resource, content, onRefresh}) => (
  <div>
    <MainTitle
      center={
        <div>
          {resource}
          &nbsp;
          <mui.IconButton tooltip="refresh" onClick={onRefresh}>
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
    <DetailsContainer>
      {content || ''}
    </DetailsContainer>
  </div>
);

DetailsResource.propTypes = {
  resource: React.PropTypes.string.isRequired,
  content: React.PropTypes.string,
  onRefresh: React.PropTypes.func.isRequired
};

export default DetailsResource;
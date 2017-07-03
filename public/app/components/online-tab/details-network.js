'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';
import MainTitle from '../main-title';

import shared from '../../shared/index';

import DetailsContainer from './details-container';

import Facade from '../../services/facade';

function renderDetails() {
  return <div>TODO</div>
}

const DetailsNetwork = ({ onRefresh }) => (
  <div>
    <MainTitle
      center={
        <div>
          <icons.EntityCore />
          &nbsp;
          Network
          &nbsp;
          <mui.IconButton tooltip="refresh" onClick={onRefresh}>
            <icons.actions.Refresh />
          </mui.IconButton>
        </div>
      }/>
    <DetailsContainer>
      <mui.List style={{overflowX:'hidden'}}>
        {renderDetails()}
      </mui.List>
    </DetailsContainer>
  </div>
);

DetailsNetwork.propTypes = {
  onRefresh: React.PropTypes.func.isRequired
};

export default DetailsNetwork;
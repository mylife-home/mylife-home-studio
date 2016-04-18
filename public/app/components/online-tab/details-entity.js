'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

import DetailsTitle from './details-title';

class DetailsEntity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTypeIcon(entity) {
    switch(entity.type) {
    case shared.EntityType.RESOURCES:
      return (
        <div>
          <base.icons.EntityResources />
          Resources
        </div>
      );

    case shared.EntityType.CORE:
      return (
        <div>
          <base.icons.EntityCore />
          Core
        </div>
      );

    case shared.EntityType.UI:
      return (
        <div>
          <base.icons.EntityUi />
          UI
        </div>
      );

    default:
      return null;
    }
  }

  render() {
    const entity = this.props.entity;

    return (
      <DetailsTitle
        center={
          <div>
            {entity.id}
            <mui.IconButton tooltip="refresh">
              <base.icons.actions.Refresh />
            </mui.IconButton>
          </div>
        }
        left={
          <div>
            <base.icons.Entity />
            Entity
          </div>
        }
        right={this.renderTypeIcon(entity)}/>
    );
  }
}

DetailsEntity.propTypes = {
  entity: React.PropTypes.object.isRequired,
};

export default DetailsEntity;
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

class TreeResource extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const entity = this.props.entity;
    const resource = this.props.resource;
    const value = { type: 'resource', entity: entity.id, resource };

    return (
      <base.SelectableListItem
        value={value}
        leftIcon={
          <base.TooltipContainer tooltip="Resource">
            <base.icons.Resource />
          </base.TooltipContainer>
        }
        primaryText={resource}
      />
    );
  }
}

TreeResource.propTypes = {
  entity: React.PropTypes.object.isRequired,
  resource: React.PropTypes.string.isRequired
};


export default TreeResource;
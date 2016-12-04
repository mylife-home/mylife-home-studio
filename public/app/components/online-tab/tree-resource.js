'use strict';

import React from 'react';
import base from '../base/index';

const TreeResource = ({ entity, resource }) => (
  <base.SelectableListItem
    value={{ type: 'resource', entity: entity.id, resource }}
    leftIcon={
      <base.TooltipContainer tooltip="Resource">
        <base.icons.Resource />
      </base.TooltipContainer>
    }
    primaryText={resource}
  />
);

TreeResource.propTypes = {
  entity: React.PropTypes.object.isRequired,
  resource: React.PropTypes.string.isRequired
};


export default TreeResource;
'use strict';

import React from 'react';
import base from '../base/index';
import icons from '../icons';

const TreeResource = ({ entity, resource }) => (
  <base.SelectableListItem
    value={{ type: 'resource', entity: entity.id, resource }}
    leftIcon={
      <base.TooltipContainer tooltip="Resource">
        <icons.Resource />
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
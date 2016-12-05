'use strict';

import React from 'react';
import base from '../base/index';
import icons from '../icons';

const TreeComponent = ({ entity, component }) => (
  <base.SelectableListItem
    value={{ type: 'component', entity: entity.id, component: component.id }}
    leftIcon={
      <base.TooltipContainer tooltip="Component">
        <icons.Component />
      </base.TooltipContainer>
    }
    primaryText={component.id}
  />
);

TreeComponent.propTypes = {
  entity: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired
};

export default TreeComponent;
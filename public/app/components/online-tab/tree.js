'use strict';

import React from 'react';
import base from '../base/index';
import icons from '../icons';

import shared from '../../shared/index';

import TreeEntity from './tree-entity';

const Tree = ({ entities, selectedValueChanged, selectedNode }) => (
  <base.SelectableList
    selectedValueChanged={selectedValueChanged}
    selectedNode={selectedNode}
  >
  {[
    <base.SelectableListItem
      key="network"
      value={{ type: 'network' }}
      open={true}
      leftIcon={
        <base.TooltipContainer tooltip="Network">
          <icons.EntityCore />
        </base.TooltipContainer>
      }
      primaryText="Network"
      nestedItems={entities
      .filter(entity => (entity.type !== shared.EntityType.UNKNOWN))
      .map((entity) => (<TreeEntity key={entity.id} entity={entity} />))}
    />
  ]}
  </base.SelectableList>
);

Tree.propTypes = {
  entities: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  selectedValueChanged: React.PropTypes.func.isRequired,
  selectedNode: React.PropTypes.object
};

export default Tree;

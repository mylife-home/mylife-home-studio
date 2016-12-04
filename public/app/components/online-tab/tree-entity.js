'use strict';

import React from 'react';
import base from '../base/index';

import shared from '../../shared/index';

import TreeResource from './tree-resource';
import TreePlugin from './tree-plugin';
import TreeComponent from './tree-component';

function renderResourcesDetails(entity) {
  if(!entity.resources) { return []; }
  return entity.resources.map(resource => (<TreeResource key={resource} entity={entity} resource={resource} />));
}

function renderCoreDetails(entity) {
  const arr = [];
  if(entity.plugins) {
    entity.plugins.forEach(plugin => { arr.push(<TreePlugin key={`${plugin.library}.${plugin.type}`} entity={entity} plugin={plugin} />); });
  }
  if(entity.components) {
    entity.components.forEach(component => { arr.push(<TreeComponent key={component.id} entity={entity} component={component} />); });
  }
  return arr;
}

function renderUiDetails(/* entity */) {
  return [];
}

function renderDetails(entity) {

  switch(entity.type) {
    case shared.EntityType.RESOURCES:
      return renderResourcesDetails(entity);

    case shared.EntityType.CORE:
      return renderCoreDetails(entity);

    case shared.EntityType.UI:
      return renderUiDetails(entity);

    default:
      return [];
  }
}

function renderTypeIcon(entity) {
  switch(entity.type) {
    case shared.EntityType.RESOURCES:
      return (
        <base.TooltipContainer tooltip="Resources entity">
          <base.icons.EntityResources />
        </base.TooltipContainer>
      );

    case shared.EntityType.CORE:
      return (
        <base.TooltipContainer tooltip="Core entity">
          <base.icons.EntityCore />
        </base.TooltipContainer>
      );

    case shared.EntityType.UI:
      return (
        <base.TooltipContainer tooltip="UI entity">
          <base.icons.EntityUi />
        </base.TooltipContainer>
      );

    default:
      return null;
  }
}

const TreeEntity = ({ entity }) => (
  <base.SelectableListItem
    value={{ type: 'entity', entity: entity.id }}
    leftIcon={renderTypeIcon(entity)}
    primaryText={entity.host}
    nestedItems={renderDetails(entity)} />
);

TreeEntity.propTypes = {
  entity: React.PropTypes.object.isRequired
};

export default TreeEntity;
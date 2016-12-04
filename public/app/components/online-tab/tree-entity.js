'use strict';

import React from 'react';
import base from '../base/index';

import shared from '../../shared/index';

import TreeResource from './tree-resource';
import TreePlugin from './tree-plugin';
import TreeComponent from './tree-component';

class TreeEntity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderResourcesDetails(entity) {
    if(!entity.resources) { return []; }
    return entity.resources.map(resource => (<TreeResource key={resource} entity={entity} resource={resource} />));
  }

  renderCoreDetails(entity) {
    const arr = [];
    if(entity.plugins) {
      entity.plugins.forEach(plugin => { arr.push(<TreePlugin key={`${plugin.library}.${plugin.type}`} entity={entity} plugin={plugin} />); });
    }
    if(entity.components) {
      entity.components.forEach(component => { arr.push(<TreeComponent key={component.id} entity={entity} component={component} />); });
    }
    return arr;
  }

  renderUiDetails(/* entity */) {
    return [];
  }

  renderDetails(entity) {

    switch(entity.type) {
      case shared.EntityType.RESOURCES:
        return this.renderResourcesDetails(entity);

      case shared.EntityType.CORE:
        return this.renderCoreDetails(entity);

      case shared.EntityType.UI:
        return this.renderUiDetails(entity);

      default:
        return [];
    }
  }

  renderTypeIcon(entity) {
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

  render() {
    const entity = this.props.entity;
    const value = { type: 'entity', entity: entity.id };

    return (
      <base.SelectableListItem
        value={value}
        leftIcon={this.renderTypeIcon(entity)}
        primaryText={entity.host}
        nestedItems={this.renderDetails(entity)} />
    );
  }
}

TreeEntity.propTypes = {
  entity: React.PropTypes.object.isRequired
};

export default TreeEntity;
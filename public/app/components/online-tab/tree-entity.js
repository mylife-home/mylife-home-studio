'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';
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

  renderUiDetails(entity) {
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

  render() {
    const entity = this.props.entity;
    const value = { type: 'entity', entity: entity.id };

    return (
      <base.SelectableListItem
        value={value}
        nestedItems={this.renderDetails(entity)}
      >{entity.id}</base.SelectableListItem>
    );
  }
}

TreeEntity.propTypes = {
  entity: React.PropTypes.object.isRequired
};

export default TreeEntity;
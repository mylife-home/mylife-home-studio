'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';

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
    return entity.resources.map(resource => (<TreeResource key={resource} resource={resource} />));
  }

  renderCoreDetails(entity) {
    const arr = [];
    if(entity.plugins) {
      entity.plugins.forEach(plugin => { arr.push(<TreePlugin key={`${plugin.library}.${plugin.type}`} plugin={plugin} />); });
    }
    if(entity.components) {
      entity.components.forEach(component => { arr.push(<TreeComponent key={component.id} component={component} />); });
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

    return (
      <mui.ListItem nestedItems={this.renderDetails(entity)}>{entity.id}</mui.ListItem>
    );
  }
}

TreeEntity.propTypes = {
  entity: React.PropTypes.object.isRequired
};

export default TreeEntity;
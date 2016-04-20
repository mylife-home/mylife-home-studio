'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

import DetailsTitle from './details-title';
import DetailsContainer from './details-container';

import Facade from '../../services/facade';

import ResourcesActionCreators from '../../actions/resources-action-creators';

class DetailsEntity extends React.Component {

  constructor(props, context) {
    super(props);
    this.state = {
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  renderPluginUsageIcon(plugin) {
    switch(plugin.usage) {
    case Facade.metadata.pluginUsage.driver:
      return (
        <base.TooltipContainer tooltip="Hardware driver">
          <base.icons.PluginDriver />
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.vpanel:
      return (
        <base.TooltipContainer tooltip="Virtual panel">
          <base.icons.PluginVPanel />
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.ui:
      return (
        <base.TooltipContainer tooltip="UI">
          <base.icons.PluginUi />
        </base.TooltipContainer>
      );

    default:
      return null;
    }
  }

  renderResourcesDetails(entity) {
    const click = (resource) => {
      const value = { type: 'resource', entity: entity.id, resource };
      this.props.changeValue(value);
    };

    if(!entity.resources) { return []; }
    return entity.resources.map(resource => (
      <mui.ListItem key={resource}
                    onTouchTap={click.bind(null, resource)}
                    leftIcon={
                      <base.TooltipContainer tooltip="Resource">
                        <base.icons.Resource />
                      </base.TooltipContainer>
                    }
                    primaryText={resource} />
    ));
  }

  renderCoreDetails(entity) {
    const clickPlugin = (plugin) => {
      const value = { type: 'plugin', entity: entity.id, plugin: `${plugin.library}.${plugin.type}` };
      this.props.changeValue(value);
    };
    const clickComponent = (component) => {
      const value = { type: 'component', entity: entity.id, component: component.id };
      this.props.changeValue(value);
    };

    const arr = [];
    if(entity.plugins) {
      entity.plugins.forEach(plugin => { arr.push(
        <mui.ListItem key={`${plugin.library}.${plugin.type}`}
                      onTouchTap={clickPlugin.bind(null, plugin)}
                      leftIcon={
                        <base.TooltipContainer tooltip="Plugin">
                          <base.icons.Plugin />
                        </base.TooltipContainer>
                      }
                      rightIcon={this.renderPluginUsageIcon(plugin)}
                      primaryText={`${plugin.library}.${plugin.type}`}  />
      ); });
    }
    if(entity.components) {
      entity.components.forEach(component => { arr.push(
        <mui.ListItem key={component.id}
                      onTouchTap={clickComponent.bind(null, component)}
                      leftIcon={
                        <base.TooltipContainer tooltip="Component">
                          <base.icons.Component />
                        </base.TooltipContainer>
                      }
                      primaryText={component.id} />
      ); });
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

  renderTypeIcon(entity) {
    switch(entity.type) {
    case shared.EntityType.RESOURCES:
      return (
        <div>
          <base.icons.EntityResources />
          &nbsp;
          Resources
        </div>
      );

    case shared.EntityType.CORE:
      return (
        <div>
          <base.icons.EntityCore />
          &nbsp;
          Core
        </div>
      );

    case shared.EntityType.UI:
      return (
        <div>
          <base.icons.EntityUi />
          &nbsp;
          UI
        </div>
      );

    default:
      return null;
    }
  }

  render() {
    const entity = this.props.entity;
    const refreshAction = () => ResourcesActionCreators.entityQuery(entity);

    return (
      <div>
        <DetailsTitle
          center={
            <div>
              {entity.id}
              &nbsp;
              <mui.IconButton tooltip="refresh" onTouchTap={refreshAction}>
                <base.icons.actions.Refresh />
              </mui.IconButton>
            </div>
          }
          left={
            <div>
              <base.icons.Entity />
              &nbsp;
              Entity
            </div>
          }
          right={this.renderTypeIcon(entity)}/>
        <DetailsContainer>
          <mui.List style={{overflowX:'hidden'}}>
            {this.renderDetails(entity)}
          </mui.List>
        </DetailsContainer>
      </div>
    );
  }
}

DetailsEntity.propTypes = {
  entity: React.PropTypes.object.isRequired,
  changeValue: React.PropTypes.func.isRequired,
  muiTheme: React.PropTypes.object
};

DetailsEntity.childContextTypes = {
  muiTheme: React.PropTypes.object
};

DetailsEntity.contextTypes = {
  muiTheme: React.PropTypes.object
};

export default DetailsEntity;
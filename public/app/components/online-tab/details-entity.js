'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';
import MainTitle from '../main-title';

import shared from '../../shared/index';

import DetailsContainer from './details-container';

import Facade from '../../services/facade';

import AppDispatcher from '../../compat/dispatcher';
import { resourcesEntityQuery } from '../../actions/index';

function renderPluginUsageIcon(plugin) {
  switch(plugin.usage) {
    case Facade.metadata.pluginUsage.driver:
      return (
        <base.TooltipContainer tooltip="Hardware driver">
          <icons.PluginDriver />
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.vpanel:
      return (
        <base.TooltipContainer tooltip="Virtual panel">
          <icons.PluginVPanel />
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.ui:
      return (
        <base.TooltipContainer tooltip="UI">
          <icons.PluginUi />
        </base.TooltipContainer>
      );

    default:
      return null;
  }
}

function renderResourcesDetails(entity, onChangeValue) {
  const click = (resource) => {
    const value = { type: 'resource', entity: entity.id, resource };
    onChangeValue(value);
  };

  if(!entity.resources) { return []; }
  return entity.resources.map(resource => (
    <mui.ListItem key={resource}
                  onTouchTap={click.bind(null, resource)}
                  leftIcon={
                    <base.TooltipContainer tooltip="Resource">
                      <icons.Resource />
                    </base.TooltipContainer>
                  }
                  primaryText={resource} />
  ));
}

function renderCoreDetails(entity, onChangeValue) {
  const clickPlugin = (plugin) => {
    const value = { type: 'plugin', entity: entity.id, plugin: `${plugin.library}.${plugin.type}` };
    onChangeValue(value);
  };
  const clickComponent = (component) => {
    const value = { type: 'component', entity: entity.id, component: component.id };
    onChangeValue(value);
  };

  const arr = [];
  if(entity.plugins) {
    entity.plugins.forEach(plugin => { arr.push(
      <mui.ListItem key={`${plugin.library}.${plugin.type}`}
                    onTouchTap={clickPlugin.bind(null, plugin)}
                    leftIcon={
                      <base.TooltipContainer tooltip="Plugin">
                        <icons.Plugin />
                      </base.TooltipContainer>
                    }
                    rightIcon={renderPluginUsageIcon(plugin)}
                    primaryText={`${plugin.library}.${plugin.type}`}  />
    ); });
  }
  if(entity.components) {
    entity.components.forEach(component => { arr.push(
      <mui.ListItem key={component.id}
                    onTouchTap={clickComponent.bind(null, component)}
                    leftIcon={
                      <base.TooltipContainer tooltip="Component">
                        <icons.Component />
                      </base.TooltipContainer>
                    }
                    primaryText={component.id} />
    ); });
  }
  return arr;
}

function renderUiDetails(/*entity*/) {
  return [];
}

function renderDetails(entity, onChangeValue) {

  switch(entity.type) {
    case shared.EntityType.RESOURCES:
      return renderResourcesDetails(entity, onChangeValue);

    case shared.EntityType.CORE:
      return renderCoreDetails(entity, onChangeValue);

    case shared.EntityType.UI:
      return renderUiDetails(entity, onChangeValue);

    default:
      return [];
  }
}

function renderTypeIcon(entity) {
  switch(entity.type) {
    case shared.EntityType.RESOURCES:
      return (
        <div>
          <icons.EntityResources />
          &nbsp;
          Resources
        </div>
      );

    case shared.EntityType.CORE:
      return (
        <div>
          <icons.EntityCore />
          &nbsp;
          Core
        </div>
      );

    case shared.EntityType.UI:
      return (
        <div>
          <icons.EntityUi />
          &nbsp;
          UI
        </div>
      );

    default:
      return null;
  }
}

const DetailsEntity = ({ entity, onChangeValue }) => (
  <div>
    <MainTitle
      center={
        <div>
          {entity.id}
          &nbsp;
          <mui.IconButton tooltip="refresh" onClick={() => AppDispatcher.dispatch(resourcesEntityQuery(entity))}>
            <icons.actions.Refresh />
          </mui.IconButton>
        </div>
      }
      left={
        <div>
          <icons.Entity />
          &nbsp;
          Entity
        </div>
      }
      right={renderTypeIcon(entity)}/>
    <DetailsContainer>
      <mui.List style={{overflowX:'hidden'}}>
        {renderDetails(entity, onChangeValue)}
      </mui.List>
    </DetailsContainer>
  </div>
);

DetailsEntity.propTypes = {
  entity: React.PropTypes.object.isRequired,
  onChangeValue: React.PropTypes.func.isRequired
};

export default DetailsEntity;
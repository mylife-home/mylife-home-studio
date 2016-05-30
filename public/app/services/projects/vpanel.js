'use strict';

import Metadata from '../metadata/index';
import common from './common';

const metadata = new Metadata(); // TODO: how to use facade ?

export default {
  createNew,
  open,
  importToolbox
};

function createNew(project) {
  project.toolbox = [];
  project.components = [];
}

function open(project, data) {
  project.toolbox = data.Toolbox.map(loadToolboxItem);
  project.components = data.Components.map(loadComponent.bind(null, project));
  createLinks(project);
}

function importToolbox(project, force, messages) {
  // TODO
  console.log('vpanel.importToolbox');
}

function loadToolboxItem(item) {
  const entityId = item.EntityName;
  return {
    entityId,
    plugins: item.Plugins.map(loadPlugin.bind(null, entityId))
  };
}

function loadPlugin(entityId, plugin) {
  const ret    = Object.assign({}, plugin);
  ret.clazz    = metadata.parseClass(plugin.clazz);
  ret.entityId = entityId;
  return ret;
}

function loadComponent(project, component) {
  return {
    id: component.Component.id,
    bindings: component.Component.bindings,
    config: common.loadMap(component.Component.config),
    designer: common.loadMap(component.Component.designer),
    plugin: findPlugin(project, component.EntityName, component.Component.library, component.Component.type)
  };
}

function createLinks(project) {
  for(const component of project.components) {
    for(const binding of component.bindings) {
      binding.local = component;
      binding.remote = findComponent(project, binding.remote_id);
    }
  }
}

function findPlugin(project, entityId, library, type) {
  for(let item of project.toolbox) {
    if(item.entityId !== entityId) { continue; }
    for(let plugin of item.plugins) {
      if(plugin.library === library && plugin.type === type) {
        return plugin;
      }
    }
  }
}

function findComponent(project, componentId) {
  for(const component of project.components) {
    if(component.id === componentId) {
      return component;
    }
  }
}

function findPluginUsage(project, plugin) {
  return project.components.filter(comp => comp.plugin === plugin);
}

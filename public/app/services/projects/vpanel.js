'use strict';

import Metadata from '../metadata/index';
import common from './common';
import OnlineStore from '../../stores/online-store'; // TODO: remove that ?
import shared from '../../shared/index';

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

function importToolbox(project, force, done) {

  let data;
  try {
    data = prepareImportToolbox(project);
  } catch(err) {
    return done(err);
  }

  if(!force && data.messages.length > 0) {
    return done(null, data.messages);
  }

  // TODO with data
  console.log('vpanel.importToolbox');

  return done();
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
  ret.rawClass = plugin.clazz;
  ret.clazz    = metadata.parseClass(plugin.clazz);
  ret.entityId = entityId;
  return ret;
}

function loadComponent(project, component) {
  return {
    id: component.Component.id,
    bindings: component.Component.bindings,
    bindingRemotes: [],
    config: common.loadMap(component.Component.config),
    designer: common.loadMap(component.Component.designer),
    plugin: findPlugin(project, component.EntityName, component.Component.library, component.Component.type)
  };
}

function createLinks(project) {
  for(const component of project.components) {
    for(const binding of component.bindings) {
      const remoteComponent = findComponent(project, binding.remote_id);
      binding.local = component;
      binding.remote = remoteComponent
      remoteComponent.bindingTargets.push(binding);
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

function prepareImportToolbox(project) {
  const entities = OnlineStore.getAll().filter(e => e.type === shared.EntityType.CORE);
  const onlinePlugins = new Map();
  for(const entity of entities) {
    for(const plugin of entity.plugins) {
      onlinePlugins.set(`${entity.id}:${plugin.library}${plugin.type}`, {
        entity,
        plugin
      });
    }
  }

  const projectPlugins = new Map();
  for(const item of project.toolbox) {
    for(const plugin of item.plugins) {
      projectPlugins.set(`${item.entityId}:${plugin.library}${plugin.type}`, {
        item,
        plugin
      });
    }
  }

  const added    = Array.from(onlinePlugins.keys()).
                         filter(id => !projectPlugins.has(id));
  const deleted  = Array.from(projectPlugins.keys()).
                         filter(id => !onlinePlugins.has(id));
  const modified = Array.from(projectPlugins.keys()).
                         filter(id => onlinePlugins.has(id)).
                         filter(id => onlinePlugins.get(id).plugin.clazz !== projectPlugins.get(id).plugin.rawClass);

  const messages = [];

  added.forEach(id => messages.push(`New plugin: ${id}`));
  deleted.forEach(id => messages.push(`Plugin deleted: ${id}`));
  modified.forEach(id => messages.push(`Plugin modified: ${id}`));

  const componentsToDelete = [];
  // TODO: go deeper in changes in class
  deleted.concat(modified).forEach(id => {
    Array.push.apply(componentsToDelete, findPluginUsage(project, projectPlugins.get(id).plugin));
  });

  const bindingsToDelete = [];
  componentsToDelete.forEach(comp => {
    Array.push.apply(bindingsToDelete, comp.bindings);
    Array.push.apply(bindingsToDelete, comp.bindingRemotes);
  });

  bindingsToDelete.forEach(binding => messages.push(
    `Binding deleted: ${binding.local_id}:${binding.action_name} -> ${binding.remote_id}:${binding.attribute_name}`));

  componentsToDelete.forEach(comp => messages.push(`Component deleted: ${comp.plugin.entityId}:${comp.id}`));

  return {
    onlinePlugins,
    projectPlugins,
    added,
    deleted,
    modified,
    componentsToDelete,
    bindingsToDelete,
    messages
  };
}
'use strict';

import Metadata from '../metadata/index';
import common from './common';
import OnlineStore from '../../stores/online-store'; // TODO: remove that ?
import shared from '../../shared/index';

const metadata = new Metadata(); // TODO: how to use facade ?

export default {
  createNew,
  open,
  prepareImportToolbox,
  executeImportToolbox
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

function prepareImportToolbox(project, done) {
  return common.loadOnlineCoreEntities((err) => {
    if(err) { return done(err); }

    let ret;
    try {
      const projectPlugins = getProjectPlugins(project);
      const onlinePlugins = getOnlinePlugins();
      const diff = pluginsDiff(projectPlugins, onlinePlugins);
      const messages = [];

      diff.added.forEach(id => messages.push(`New plugin: ${id}`));
      diff.deleted.forEach(id => messages.push(`Plugin deleted: ${id}`));
      diff.modified.forEach(id => messages.push(`Plugin modified: ${id}`));

      const componentsToDelete = [];
      // TODO: go deeper in changes in class
      diff.deleted.concat(diff.modified).forEach(id => {
        const usage = findPluginUsage(project, projectPlugins.get(id).plugin);
        if(usage.length) {
          Array.push.apply(componentsToDelete, usage);
        }
      });

      const bindingsToDelete = [];
      componentsToDelete.forEach(comp => {
        Array.push.apply(bindingsToDelete, comp.bindings);
        Array.push.apply(bindingsToDelete, comp.bindingTargets);
      });

      bindingsToDelete.forEach(binding => messages.push(
        `Binding deleted: ${binding.local_id}:${binding.action_name} -> ${binding.remote_id}:${binding.attribute_name}`));

      componentsToDelete.forEach(comp => messages.push(`Component deleted: ${comp.plugin.entityId}:${comp.id}`));

      ret = {
        project,
        onlinePlugins,
        projectPlugins,
        added: diff.added,
        deleted: diff.deleted,
        modified: diff.modified,
        componentsToDelete,
        bindingsToDelete,
        messages
      };

    } catch(err) {
      return done(err);
    }

    return done(null, ret);
  });
}

function executeImportToolbox(data, done) {
  try {
    // TODO
  } catch(err) {
    return done(err);
  }

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
    bindingTargets: [],
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

function getProjectPlugins(project) {
  const ret = new Map();
  for(const item of project.toolbox) {
    for(const plugin of item.plugins) {
      ret.set(`${item.entityId}:${plugin.library}:${plugin.type}`, {
        item,
        plugin
      });
    }
  }
  return ret;
}

function getOnlinePlugins() {
  const entities = OnlineStore.getAll().filter(e => e.type === shared.EntityType.CORE);
  const ret = new Map();
  for(const entity of entities) {
    for(const plugin of entity.plugins) {
      ret.set(`${entity.id}:${plugin.library}:${plugin.type}`, {
        entity,
        plugin
      });
    }
  }
  return ret;
}

function pluginsDiff(projectPlugins, onlinePlugins) {

  return {
    added    : Array.from(onlinePlugins.keys()).
                     filter(id => !projectPlugins.has(id)),
    deleted  : Array.from(projectPlugins.keys()).
                     filter(id => !onlinePlugins.has(id)),
    modified : Array.from(projectPlugins.keys()).
                     filter(id => onlinePlugins.has(id)).
                     filter(id => onlinePlugins.get(id).plugin.clazz !== projectPlugins.get(id).plugin.rawClass)
  };
}

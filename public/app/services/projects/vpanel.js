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
  executeImportToolbox,
  importDriverComponents,
  prepareDeployVPanel,
  executeDeployVPanel,
  prepareDeployDrivers,
  executeDeployDrivers
};

function createNew(project) {
  project.toolbox = [];
  project.components = [];
}

function open(project, data) {
  project.toolbox = data.Toolbox.map(loadToolboxItem);
  project.components = data.Components.map(loadComponent.bind(null, project));
  validate(project);
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

      const componentsToDelete = new Set();
      // TODO: go deeper in changes in class
      diff.deleted.concat(diff.modified).forEach(id => {
        const usage = findPluginUsage(project, projectPlugins.get(id).plugin);
        for(const comp of usage) {
          componentsToDelete.add(comp);
        }
      });

      const bindingsToDelete = new Set();
      componentsToDelete.forEach(comp => {
        for(const binding of comp.bindings.concat(comp.bindingTargets)) {
          bindingsToDelete.add(binding);
        }
      });

      bindingsToDelete.forEach(binding => messages.push(
        `Binding deleted: ${binding.local.id}:${binding.local_action} -> ${binding.remote_id}:${binding.remote_attribute}`));

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

    for(const binding of data.bindingsToDelete) {
      arrayRemoveByValue(binding.local.bindings, binding);
      arrayRemoveByValue(binding.remote.bindingTargets, binding);
      data.project.dirty = true;
    }

    for(const component of data.componentsToDelete) {
      arrayRemoveByValue(data.project.components, component);
      data.project.dirty = true;
    }

    for(const del of data.deleted.concat(data.modified)) {
      const { item, plugin } = data.projectPlugins.get(del);
      arrayRemoveByValue(item.plugins, plugin);
      data.project.dirty = true;
    }

    for(const add of data.added.concat(data.modified)) {
      const {entity, plugin } = data.onlinePlugins.get(add);
      const entityId = entity.id;
      const item = getToolboxItem(data.project, entityId);
      item.plugins.push(loadPlugin(entityId, plugin));
      data.project.dirty = true;
    }

    // clean empty toolbox items
    data.project.toolbox.
                 filter(it => !it.plugins.length).
                 forEach(arrayRemoveByValue.bind(null, data.project.toolbox));

  } catch(err) {
    return done(err);
  }

  return done();
}

function importDriverComponents(project, done) {
  return common.loadOnlineCoreEntities((err) => {
    if(err) { return done(err); }

    try {
      const projectPlugins = getProjectPlugins(project);
      const onlinePlugins = getOnlinePlugins();
      const onlineComponents = getOnlineComponents();
      const diff = pluginsDiff(projectPlugins, onlinePlugins);
      if(diff.count) {
        throw new Error('plugins are outdated');
      }

      for(const [ id, value ] of onlineComponents.entries()) {
        if(findComponent(project, id)) { continue; }

        const onlineComponent = value.component;
        const plugin = findPlugin(project, value.entity.id, onlineComponent.library, onlineComponent.type);
        if(plugin.usage !== metadata.pluginUsage.driver) { continue; }

        const component = {
          id: onlineComponent.id,
          bindings: [],
          bindingTargets: [],
          config: common.loadMapOnline(onlineComponent.config),
          designer: common.loadMapOnline(onlineComponent.designer),
          plugin
        };

        project.components.push(component);
        project.dirty = true;
      }

    } catch(err) {
      return done(err);
    }

    return done();
  });
}

function prepareDeployVPanel(project, done) {
  return common.loadOnlineCoreEntities((err) => {
    if(err) { return done(err); }

    console.log('prepareDeployVPanel');
    return done();
  });
}

function executeDeployVPanel(data, done) {
  console.log('executeDeployVPanel');
  return done();
}

function prepareDeployDrivers(project, done) {
  return common.loadOnlineCoreEntities((err) => {
    if(err) { return done(err); }

    console.log('prepareDeployDrivers');
    return done();
  });
}

function executeDeployDrivers(data, done) {
  console.log('executeDeployDrivers');
  return done();
}

function loadToolboxItem(item) {
  const entityId = item.EntityName;
  return {
    entityId,
    plugins: item.Plugins.map(loadPlugin.bind(null, entityId))
  };
}

function getToolboxItem(project, entityId) {
  for(const item of project.toolbox) {
    if(item.entityId === entityId) {
      return item;
    }
  }
  const ret = { entityId, plugins: [] };
  project.toolbox.push(ret);
  return ret;
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

function validate(project) {
  removeDuplicates(project.components, c => c.id);
  for(const comp of project.components) {
    removeDuplicates(comp.bindings, b => `${b.remote_id}:${b.remote_attribute}:${b.local_action}`);
  }
}

function removeDuplicates(array, itemValue) {
  const values = new Set();
  const indexes = [];
  for(const [i, it] of array.entries()) {
    const value = itemValue(it);
    if(values.has(value)) {
      indexes.push(i);
      continue;
    }
    values.add(value);
  }
  indexes.reverse();
  for(const i of indexes) {
    array.splice(i, 1);
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

function arrayRemoveByValue(array, item) {
  const index = array.indexOf(item);
  if(index === -1) { return; }
  array.splice(index, 1);
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

function getOnlineComponents() {
  const entities = OnlineStore.getAll().filter(e => e.type === shared.EntityType.CORE);
  const ret = new Map();
  for(const entity of entities) {
    for(const component of entity.components) {
      ret.set(component.id, {
        entity,
        component
      });
    }
  }
  return ret;
}

function pluginsDiff(projectPlugins, onlinePlugins) {

  const ret = {
    added    : Array.from(onlinePlugins.keys()).
                     filter(id => !projectPlugins.has(id)),
    deleted  : Array.from(projectPlugins.keys()).
                     filter(id => !onlinePlugins.has(id)),
    modified : Array.from(projectPlugins.keys()).
                     filter(id => onlinePlugins.has(id)).
                     filter(id => onlinePlugins.get(id).plugin.clazz !== projectPlugins.get(id).plugin.rawClass)
  };

  ret.count = ret.added.length +
              ret.deleted.length +
              ret.modified.length;

  return ret;
}

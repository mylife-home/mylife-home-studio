'use strict';

import async from 'async';
import Metadata from '../metadata/index';
import common from './common';
import OnlineStore from '../../stores/online-store'; // TODO: remove that ?
import shared from '../../shared/index';
import Resources from '../resources';

const metadata = new Metadata(); // TODO: how to use facade ?
const resources = new Resources(); // TODO: how to use facade ?

let operationId = 0;

export default {
  createNew,
  open,
  validate,
  serialize,
  prepareImportToolbox,
  executeImportToolbox,
  importDriverComponents,
  prepareDeployVPanel,
  prepareDeployDrivers,
  executeDeploy,
  createComponent,
  canCreateBinding,
  createBinding
};

function createNew(project) {
  project.toolbox = [];
  project.components = [];
}

function open(project, data) {
  data = JSON.parse(JSON.stringify(data));
  project.toolbox = data.Toolbox.map(loadToolboxItem);
  project.components = data.Components.map(loadComponent.bind(null, project));
  validateOpen(project);
  createLinks(project);
}

function validate(project, msgs) {
  common.validate(project, msgs);

  // component id set and unique
  const ids = new Set();
  const idsdup = new Set();
  let noidCount = 0;
  for(const comp of project.components) {
    const id = comp.id;
    if(!id) {
      ++noidCount;
      continue;
    }

    if(ids.has(id)) {
      idsdup.add(id);
      continue;
    }

    ids.add(id);
  }

  if(noidCount > 0) {
    msgs.push(`${noidCount} components have no id`);
  }
  for(const id of idsdup) {
    msgs.push(`Duplicate component id: ${id}`);
  }

  // no binding duplicate
  for(const comp of project.components) {
    const bindings = new Set();
    const duplicates = new Set();

    for(const binding of comp.bindings) {
      const bindingId = `${binding.remote_id}.${binding.remote_attribute} -> ${comp.id}.${binding.local_action}`;
      if(bindings.has(bindingId)) {
        duplicates.add(bindingId);
        continue;
      }

      bindings.add(bindingId);
    }

    for(const binding of duplicates) {
      msgs.push(`Duplicate binding: ${bindingId}`);
    }
  }
}

function serialize(project) {
  common.serialize(project);

  project.raw.Components = project.components.map(component => ({
    Component : {
      id       : component.id,
      library  : component.plugin.library,
      type     : component.plugin.type,
      bindings : component.bindings.map(binding => ({
        local_action    : binding.local_action,
        remote_attribute: binding.remote_attribute,
        remote_id       : binding.remote.id })),
      config   : common.serializeMap(component.config),
      designer : common.serializeMap({
        Location: `${component.designer.location.x},${component.designer.location.y}`
      })
    },
    EntityName : component.plugin.entityId
  }));

  project.raw.Toolbox = project.toolbox.map(item => ({
    EntityName : item.entityId,
    Plugins    : item.plugins.map(plugin => ({
      clazz   : plugin.rawClass,
      config  : plugin.rawConfig,
      library : plugin.library,
      type    : plugin.type,
      usage   : plugin.usage,
      version : plugin.version
    }))
  }));
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
      common.dirtify(data.project);
    }

    for(const component of data.componentsToDelete) {
      arrayRemoveByValue(data.project.components, component);
      common.dirtify(data.project);
    }

    for(const del of data.deleted.concat(data.modified)) {
      const { item, plugin } = data.projectPlugins.get(del);
      arrayRemoveByValue(item.plugins, plugin);
      common.dirtify(data.project);
    }

    for(const add of data.added.concat(data.modified)) {
      const {entity, plugin } = data.onlinePlugins.get(add);
      const entityId = entity.id;
      const item = getToolboxItem(data.project, entityId);
      item.plugins.push(common.loadPlugin(plugin, entityId));
      common.dirtify(data.project);
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
      checkPluginsUpToDate(projectPlugins, onlinePlugins);
      const onlineComponents = getOnlineComponents();

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
          designer: [
            { location: { x: 0, y: 0 } }
          ],
          plugin
        };

        project.components.push(component);
        common.dirtify(project);
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

    let operations;
    try {
      checkSaved(project);

      const projectPlugins = getProjectPlugins(project);
      const onlinePlugins = getOnlinePlugins();
      checkPluginsUpToDate(projectPlugins, onlinePlugins);

      const onlineComponents = getOnlineComponents();
      const usages = [metadata.pluginUsage.vpanel, metadata.pluginUsage.ui];

      const bindingsToDelete = new Map();
      const componentsToDelete = new Map();
      const componentsToCreate = new Map();
      const bindingsToCreate = new Map();

      for(const [id, value] of onlineComponents.entries()) {
        const onlineComponent = value.component;

        for(const binding of onlineComponent.bindings) {
          const bindingId = `${binding.remote_id}.${binding.remote_attribute}->${id}.${binding.local_action}`;
          bindingsToDelete.set(bindingId, {
            entityId: value.entity.id,
            component: onlineComponent,
            binding
          });
        }

        const plugin = findPlugin(project, value.entity.id, onlineComponent.library, onlineComponent.type);
        if(!usages.includes(plugin.usage)) { continue; }
        componentsToDelete.set(id, {
          entityId: value.entity.id,
          component: onlineComponent
        });
      }

      for(const projectComponent of project.components) {

        for(const binding of projectComponent.bindings) {
          const bindingId = `${binding.remote_id}.${binding.remote_attribute}->${projectComponent.id}.${binding.local_action}`;
          bindingsToCreate.set(bindingId, {
            entityId: projectComponent.plugin.entityId,
            component: projectComponent,
            binding
          });
        }

        if(!usages.includes(projectComponent.plugin.usage)) { continue; }
        componentsToCreate.set(projectComponent.id, {
          entityId: projectComponent.plugin.entityId,
          component: projectComponent
        });
      }

      // TODO: avoid delete all/rebuild all

      operations = [];

      for(const value of bindingsToDelete.values()) {
        operations.push(createOperationDeleteBinding(value.entityId, value.component.id, value.binding));
      }

      for(const value of componentsToDelete.values()) {
        operations.push(createOperationDeleteComponent(value.entityId, value.component.id));
      }

      for(const value of componentsToCreate.values()) {
        operations.push(createOperationCreateComponent(value.component));
      }

      for(const value of bindingsToCreate.values()) {
        operations.push(createOperationCreateBinding(value.component, value.binding));
      }
    } catch(err) {
      return done(err);
    }

    return done(null, { project, operations });
  });
}

function prepareDeployDrivers(project, done) {
  return common.loadOnlineCoreEntities((err) => {
    if(err) { return done(err); }

    let operations;
    try {
      checkSaved(project);

      const projectPlugins = getProjectPlugins(project);
      const onlinePlugins = getOnlinePlugins();
      checkPluginsUpToDate(projectPlugins, onlinePlugins);

      const onlineComponents = getOnlineComponents();

      operations = [];

      // we deploy each entity in a separate way
      const entityIds = new Set(project.components.
        filter(c => c.plugin.usage === metadata.pluginUsage.driver).
        map(c => c.plugin.entityId));

      for(const entityId of entityIds) {
        const onlineIds = [];
        const projectComponents = [];

        for(const [id, value] of onlineComponents) {
          if(value.entity.id !== entityId) { continue; }
          const plugin = findPlugin(project, value.entity.id, value.component.library, value.component.type);
          if(plugin.usage !== metadata.pluginUsage.driver) { continue; }
          onlineIds.push(id);
        }

        for(const component of project.components) {
          if(component.plugin.usage !== metadata.pluginUsage.driver) { continue; }
          if(component.plugin.entityId !== entityId) { continue; }
          projectComponents.push(component);
        }

        const bindingsToDelete = new Map();
        const componentToDelete = new Map();
        const componentsToCreate = new Map();

        for(const onlineId of onlineIds) {
          const projectComponent = projectComponents.find(c => c.id === onlineId);
          const onlineComponent = onlineComponents.get(onlineId);

          // does not exist anymore
          if(!projectComponent) {
            componentIdsToDelete.set(onlineId, onlineComponent);
            continue;
          }

          // no changes -> skip
          if(componentsAreSame(onlineComponent, projectComponent)) {
            continue;
          }

          // still exist but changes -> recreate
          componentToDelete.set(onlineId, onlineComponent);
          componentsToCreate.set(projectComponent.id, projectComponent);
        }

        // only new components
        for(const projectComponent of projectComponents) {
          if(onlineIds.includes(projectComponent.id)) { continue; }

          componentsToCreate.set(projectComponent.id, projectComponent);
        }

        for(const compId of componentToDelete) {
          // remove targetBindings
          for(const [key, value] of getOnlineTargetBindings(onlineComponents, compId).entries()) {
            bindingsToDelete.set(key, value);
          }
        }

        for(const value of bindingsToDelete.values()) {
          operations.push(createOperationDeleteBinding(value.entity.id, value.component.id, value.binding));
        }

        for(const value of componentToDelete.values()) {
          operations.push(createOperationDeleteComponent(value.entity.id, value.component.id));
        }

        for(const value of componentsToCreate.values()) {
          operations.push(createOperationCreateComponent(value));
        }
      }
    } catch(err) {
      return done(err);
    }

    return done(null, { project, operations });
  });
}

function executeDeploy(data, done) {
  console.log('executeDeploy', data);
  const actions = data.operations.filter(o => o.enabled).map(o => o.action);
  async.series(actions, (err) => {
    if(err) { return done(err); }
    return common.loadOnlineCoreEntities(done);
  });
}

function createComponent(project, location, pluginData) {
  const plugin = findPlugin(project, pluginData.entityId, pluginData.library, pluginData.type);
  const config = {};
  plugin.config.forEach(item => config[item.name] = metadata.getConfigTypeDefaultValue(item.type));

  const component = {
    id: `component_${common.uid()}`,
    bindings: [],
    bindingTargets: [],
    config,
    designer: { location },
    plugin
  };

  project.components.push(component);
  common.dirtify(project);

  return component;
}

function canCreateBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName) {
  const remoteComponent = findComponent(project, remoteComponentId);
  const localComponent  = findComponent(project, localComponentId);
  const remoteAttribute = remoteComponent.plugin.clazz.attributes.find(a => a.name === remoteAttributeName);
  const localAction     = localComponent.plugin.clazz.actions.find(a => a.name === localActionName);

  // check types
  if(localAction.types.length !== 1 || localAction.types[0] !== remoteAttribute.type) {
    return false;
  }

  // cannot bind on self
  if(remoteComponent.id === localComponent.id) {
    return false;
  }

  // check if a binding already exists
  for(const binding of localComponent.bindings) {
    if(binding.remote.id === remoteComponent.id &&
       binding.remote_attribute === remoteAttribute.name &&
       binding.local_action === localAction.name) {
      return false;
    }
  }

  return true;
}

function createBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName) {
  const remoteComponent = findComponent(project, remoteComponentId);
  const localComponent  = findComponent(project, localComponentId);
  const remoteAttribute = remoteComponent.plugin.clazz.attributes.find(a => a.name === remoteAttributeName);
  const localAction     = localComponent.plugin.clazz.actions.find(a => a.name === localActionName);

  const binding = {

  }
}

function loadToolboxItem(item) {
  const entityId = item.EntityName;
  return {
    entityId,
    plugins: item.Plugins.map((plugin) => common.loadPlugin(plugin, entityId))
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

function loadComponent(project, component) {
  return {
    id: component.Component.id,
    bindings: component.Component.bindings,
    bindingTargets: [],
    config: common.loadMap(component.Component.config),
    designer: loadComponentDesigner(component.Component.designer),
    plugin: findPlugin(project, component.EntityName, component.Component.library, component.Component.type)
  };
}

function loadComponentDesigner(designer) {
  const map = common.loadMap(designer);
  const ret = {};

  if(map.Location) {
    const split = map.Location.split(',');
    ret.location = {
      x: parseInt(split[0]),
      y: parseInt(split[1])
    };
  }

  return ret;
}

function createLinks(project) {
  for(const component of project.components) {
    for(const binding of component.bindings) {
      const remoteComponent = findComponent(project, binding.remote_id);
      delete binding.remote_id;
      binding.local = component;
      binding.remote = remoteComponent
      remoteComponent.bindingTargets.push(binding);
    }
  }
}

function validateOpen(project) {
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

function checkPluginsUpToDate(projectPlugins, onlinePlugins) {
  const diff = pluginsDiff(projectPlugins, onlinePlugins);
  if(diff.count) {
    throw new Error('plugins are outdated');
  }
}

function checkSaved(project) {
  if(project.dirty) {
    throw new Error('project must be saved');
  }
}

function componentsAreSame(onlineComponent, projectComponent) {
  if(onlineComponent.component.id !== projectComponent.id) { return false; }
  if(onlineComponent.entity.id !== projectComponent.plugin.entityId) { return false; }
  if(onlineComponent.component.library !== projectComponent.plugin.library) { return false; }
  if(onlineComponent.component.type !== projectComponent.plugin.type) { return false; }
  if(!mapAreSame(common.loadMapOnline(onlineComponent.component.config), projectComponent.config)) { return false; }
  return true;
}

function mapAreSame(map1, map2) {
  const keys1 = Object.keys(map1);
  const keys2 = Object.keys(map2);
  if(keys1.length !== keys2.length) { return false; }
  keys1.sort();
  keys2.sort();
  for(let i=0; i<keys1.length; ++i) {
    if(keys1[i] !== keys2[i]) { return false; }
    const key = keys1[i];
    if(map1[key] !== map2[key]) { return false; }
  }
  return true;
}

function getOnlineTargetBindings(onlineComponents, remoteId) {
  const ret = new Map();
  for(const [id, value] of onlineComponents) {
    for(const binding of value.component.bindings) {
      if(binding.remote_id === remoteId) { continue; }
      ret.set(`${binding.remote_id}.${binding.remote_attribute}->${id}.${binding.local_action}`, {
        entity: value.entity,
        component: value.component,
        binding
      });
    }
  }
  return ret;
}

function createOperationDeleteBinding(entityId, componentId, binding) {
  return {
    id: ++operationId,
    enabled: true,
    description: `Delete binding ${binding.remote_id}.${binding.remote_attribute} -> ${componentId}.${binding.local_action} on entity ${entityId}`,
    action: (done) => {
      return resources.queryComponentUnbind(entityId, {
        remote_id: binding.remote_id,
        remote_attribute: binding.remote_attribute,
        local_id: componentId,
        local_action: binding.local_action
      }, done);
    }
  };
}

function createOperationDeleteComponent(entityId, componentId) {
  return {
    id: ++operationId,
    enabled: true,
    description: `Delete component ${componentId} on entity ${entityId}`,
    action: (done) => {
      return resources.queryComponentDelete(entityId, componentId, done);
    }
  };
}

function createOperationCreateComponent(component) {
  return {
    id: ++operationId,
    enabled: true,
    description: `Create component ${component.id} on entity ${component.plugin.entityId}`,
    action: (done) => {
      return resources.queryComponentCreate(component.plugin.entityId, {
          comp_id: component.id,
          library: component.plugin.library,
          comp_type: component.plugin.type,
          config: mapToAction(component.config),
          designer: []
      }, done);
    }
  };
}

function createOperationCreateBinding(component, binding) {
  return {
    id: ++operationId,
    enabled: true,
    description: `Create binding ${binding.remote_id}.${binding.remote_attribute} -> ${component.id}.${binding.local_action} on entity ${component.plugin.entityId}`,
    action: (done) => {
      return resources.queryComponentBind(component.plugin.entityId, {
        remote_id: binding.remote_id,
        remote_attribute: binding.remote_attribute,
        local_id: component.id,
        local_action: binding.local_action
      }, done);
    }
  };
}

function mapToAction(map) {
  const ret = [];
  for(const key of Object.keys(map)) {
    const value = map[key];
    ret.push({ key, value });
  }
  return ret;
}
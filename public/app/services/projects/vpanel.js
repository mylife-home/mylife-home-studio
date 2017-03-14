'use strict';

import Immutable from 'immutable';
import Metadata from '../metadata/index';
import common from './common';
import { newId, snapToGrid } from '../../utils/index';

const metadata = new Metadata(); // TODO: how to use facade ?

export default {
  createNew,
  open,
  validate,
  serialize,
  prepareImportToolbox,
  importDriverComponents,
  prepareDeployVPanel,
  prepareDeployDrivers,
  createComponent,
  canCreateBinding,
  createBinding
};

function createNew() {
  return {
    plugins    : Immutable.Map(),
    components : Immutable.Map(),
    bindings   : Immutable.Map()
  };
}

function open(data) {
  const project = {
    plugins : common.loadToMap([].concat(... data.Toolbox.map(loadToolboxItem)), x => x)
  };

  project.components = common.loadToMap(data.Components, (raw) => loadComponent(project, raw));

  validateOpen(project);
  createLinks(project);

  return project;
}

function loadToolboxItem(item) {
  return item.Plugins.map((plugin) => ({
    ... common.loadPlugin(plugin, item.EntityName),
    uid: newId()
  }));
}

function loadComponent(project, component) {
  return {
    uid: newId(),
    id: component.Component.id,
    tmpBindings: component.Component.bindings,
    config: common.loadMap(component.Component.config),
    designer: loadComponentDesigner(component.Component.designer),
    plugin: findPlugin(project, component.EntityName, component.Component.library, component.Component.type).uid
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

  project.components.forEach(comp => {
    comp.bindings       = Immutable.Set().asMutable();
    comp.bindingTargets = Immutable.Set().asMutable();
    return true;
  });

  project.bindings = Immutable.Map().withMutations(bindings => {
    for(const component of project.components.values()) {
      for(const tmpBinding of component.tmpBindings) {
        const remoteComponent = findComponent(project, tmpBinding.remote_id);

        const binding = {
          uid             : newId(),
          local           : component.uid,
          remote          : remoteComponent.uid,
          localAction     : tmpBinding.local_action,
          remoteAttribute : tmpBinding.remote_attribute
        };

        component.bindings.add(binding.uid);
        remoteComponent.bindingTargets.add(binding.uid);
        bindings.set(binding.uid, binding);
      }
      delete component.tmpBindings;
    }
  });

  project.components.forEach(comp => {
    comp.bindings       = comp.bindings.asImmutable();
    comp.bindingTargets = comp.bindingTargets.asImmutable();
    return true;
  });
}

function validateOpen(project) {
  project.components = removeDuplicates(project.components, c => c.id);
  for(const comp of project.components.values()) {
    removeDuplicates(comp.tmpBindings, b => `${b.remote_id}:${b.remote_attribute}:${b.local_action}`);
  }

  project.components.forEach(comp => validateConfig(project, comp));
}

function validateConfig(project, component) {
  const config = component.config;
  const plugin = project.plugins.get(component.plugin);
  plugin.config.forEach(item => {
    if(config.hasOwnProperty(item.name)) { return; }
    config[item.name] = metadata.getConfigTypeDefaultValue(item.type);
  });
  // remove extra keys
  const configKeys = plugin.config.map(item => item.name);
  for(const key of Object.keys(config)) {
    if(configKeys.includes(key)) { continue; }
    delete config[key];
  }
}

function removeDuplicates(container, itemValue) {
  const values = new Set();
  const keys = [];
  for(const [key, it] of container.entries()) {
    const value = itemValue(it);
    if(values.has(value)) {
      keys.push(key);
      continue;
    }
    values.add(value);
  }

  if(Array.isArray(container)) {
    keys.reverse();
    for(const i of keys) {
      container.splice(i, 1);
    }
    return;
  }

  return container.withMutations(map => {
    keys.forEach(key => map.delete(key));
  });
}

function validate(project, msgs) {
  common.validate(project, msgs);

  // component id set and unique
  {
    const { noIdCount, duplicates } = common.checkIds(project.components);
    if(noIdCount > 0) {
      msgs.push(`${noIdCount} components have no id`);
    }
    for(const id of duplicates) {
      msgs.push(`Duplicate component id: ${id}`);
    }
  }

  // no binding duplicate
  {
    const bindings = new Set();
    const duplicates = new Set();
    for(const binding of project.bindings.values()) {
      const bindingId = `${binding.remote}.${binding.remoteAttribute} -> ${binding.local}.${binding.localAction}`;
      if(bindings.has(bindingId)) {
        duplicates.add(bindingId);
        continue;
      }

      bindings.add(bindingId);
    }

    for(const bindingId of duplicates) {
      msgs.push(`Duplicate binding: ${bindingId}`);
    }
  }
}

function serialize(project) {
  return {
    ...common.serialize(project),
    Components : common.serializeFromMap(project.components, comp => serializeComponent(project, comp)),
    Toolbox    : project.plugins.
      groupBy(it => it.entityId).
      map((map, entityId) => ({
        EntityName : entityId,
        Plugins: map.map(plugin => ({
          clazz   : plugin.raw.clazz,
          config  : plugin.raw.config,
          library : plugin.library,
          type    : plugin.type,
          usage   : plugin.usage,
          version : plugin.version
        })).toArray()
      })).toArray()
  };
}

function serializeComponent(project, component) {
  const plugin   = project.plugins.get(component.plugin);
  const bindings = project.bindings.valueSeq()
    .filter(binding => binding.local === component.uid)
    .map(binding => ({
      local_action     : binding.localAction,
      remote_attribute : binding.remoteAttribute,
      remote_id        : project.components.get(binding.remote).id
    }))
    .toArray();

  return {
    Component : {
      id       : component.id,
      library  : plugin.library,
      type     : plugin.type,
      bindings,
      config   : common.serializeMap(component.config),
      designer : common.serializeMap({
        Location: `${component.designer.location.x},${component.designer.location.y}`
      })
    },
    EntityName : plugin.entityId
  };
}

function prepareImportToolbox(project, coreEntities) {

  const projectPlugins = getProjectPlugins(project);
  const onlinePlugins  = common.getOnlinePlugins(coreEntities);
  const diff           = pluginsDiff(projectPlugins, onlinePlugins);
  const messages       = [];
  const operations     = [];

  diff.added.forEach(id => messages.push(`New plugin: ${id}`));
  diff.deleted.forEach(id => messages.push(`Plugin deleted: ${id}`));
  diff.modified.forEach(id => messages.push(`Plugin modified: ${id}`));

  // TODO: go deeper in changes in class
  for(const id of diff.deleted.concat(diff.modified)) {
    for(const comp of findPluginUsage(project, projectPlugins.get(id).plugin.uid)) {
      messages.push(`Component deleted: ${comp.plugin.entityId}:${comp.id}`);
      operations.push({ type: 'deleteComponent', component: comp.uid });
    }
  }

  for(const del of diff.deleted.concat(diff.modified)) {
    const plugin = projectPlugins.get(del);
    operations.push({ type: 'deletePlugin', plugin: plugin.uid });
  }

  for(const add of diff.added.concat(diff.modified)) {
    const { entityId, plugin } = onlinePlugins.get(add);
    const pluginObject = { ...common.loadPlugin(plugin, entityId), uid: newId() };
    operations.push({ type: 'newPlugin', plugin: pluginObject });
  }

  return { messages, operations };
}

function importDriverComponents(project, coreEntities) {

  const components       = [];
  const projectPlugins   = getProjectPlugins(project);
  const onlinePlugins    = common.getOnlinePlugins(coreEntities);
  const onlineComponents = common.getOnlineComponents(coreEntities);

  checkPluginsUpToDate(projectPlugins, onlinePlugins);

  for(const [ id, value ] of onlineComponents.entries()) {
    if(findComponent(project, id)) { continue; }

    const onlineComponent = value.component;
    const plugin          = findPlugin(project, value.entityId, onlineComponent.library, onlineComponent.type);
    if(plugin.usage !== metadata.pluginUsage.driver) { continue; }

    const component = {
      uid            : newId(),
      id             : onlineComponent.id,
      bindings       : Immutable.Set(),
      bindingTargets : Immutable.Set(),
      config         : common.loadMapOnline(onlineComponent.config),
      designer       : { location: { x: 0, y: 0 } },
      plugin         : plugin.uid
    };

    validateConfig(project, component);
    components.push(component);
  }

  return components;
}

function prepareDeployVPanel(project, coreEntities) {

  common.checkSaved(project);

  const projectPlugins = getProjectPlugins(project);
  const onlinePlugins  = common.getOnlinePlugins(coreEntities);
  checkPluginsUpToDate(projectPlugins, onlinePlugins);

  const onlineComponents = common.getOnlineComponents(coreEntities);
  const usages           = [metadata.pluginUsage.vpanel, metadata.pluginUsage.ui];

  const bindingsToDelete   = new Map();
  const componentsToDelete = new Map();
  const componentsToCreate = new Map();
  const bindingsToCreate   = new Map();

  for(const value of onlineComponents.values()) {
    const onlineComponent = value.component;

    for(const binding of onlineComponent.bindings) {
      const bindingId = `${binding.remote_id}.${binding.remote_attribute}->${onlineComponent.id}.${binding.local_action}`;
      bindingsToDelete.set(bindingId, {
        entityId        : value.entityId,
        remoteId        : binding.remote_id,
        remoteAttribute : binding.remote_attribute,
        localId         : onlineComponent.id,
        localAction     : binding.local_action
      });
    }

    const plugin = findPlugin(project, value.entityId, onlineComponent.library, onlineComponent.type);
    if(!usages.includes(plugin.usage)) { continue; }

    componentsToDelete.set(onlineComponent.id, value);
  }

  for(const component of project.components.values()) {
    const plugin = project.plugins.get(component.plugin);

    if(!usages.includes(plugin.usage)) { continue; }

    componentsToCreate.set(component.id, {
      entityId : plugin.entityId,
      component,
      plugin
    });
  }

  for(const binding of project.bindings.values()) {
    const localComponent  = project.components.get(binding.local);
    const remoteComponent = project.components.get(binding.remote);
    const plugin          = project.plugins.get(localComponent.plugin);

    const bindingId = `${remoteComponent.id}.${binding.remoteAttribute}->${localComponent.id}.${binding.localAction}`;
    bindingsToCreate.set(bindingId, {
      entityId        : plugin.entityId,
      remoteId        : remoteComponent.id,
      remoteAttribute : binding.remoteAttribute,
      localId         : localComponent.id,
      localAction     : binding.localAction
    });
  }

  const unchangedComponents = [];
  for(const [id, componentDelete] of componentsToDelete.entries()) {
    const componentCreate = componentsToCreate.get(id);
    if(!componentCreate) { continue; }
    if(!componentsAreSame(componentDelete, componentCreate)) { continue; }
    unchangedComponents.push(id);
  }

  console.log('removed unchanged components from operation list', unchangedComponents); // eslint-disable-line no-console
  for(const id of unchangedComponents) {
    componentsToDelete.delete(id);
    componentsToCreate.delete(id);
  }

  const unchangedBindings = [];

  for(const [id, bindingDelete] of bindingsToDelete.entries()) {
    const bindingCreate = bindingsToCreate.get(id);
    if(!bindingCreate) { continue; }
    const ownerId = bindingDelete.localId;
    if(componentsToDelete.get(ownerId)) { continue; }
    if(componentsToCreate.get(ownerId)) { continue; }

    unchangedBindings.push(id);
  }

  console.log('removed unchanged bindings from operation list', unchangedBindings); // eslint-disable-line no-console
  for(const id of unchangedBindings) {
    bindingsToDelete.delete(id);
    bindingsToCreate.delete(id);
  }

  return fillOperations(null, bindingsToDelete, componentsToDelete, componentsToCreate, bindingsToCreate);
}

function prepareDeployDrivers(project, coreEntities) {

  common.checkSaved(project);
  const operations = [];

  const projectPlugins   = getProjectPlugins(project);
  const onlinePlugins    = common.getOnlinePlugins(coreEntities);
  const onlineComponents = common.getOnlineComponents(coreEntities);
  checkPluginsUpToDate(projectPlugins, onlinePlugins);

  const allOnlineComponents = Array.from(onlineComponents.values())
    .map(value => ({
      ...value,
      plugin : findPlugin(project, value.entityId, value.component.library, value.component.type)
    }))
    .filter(c => c.plugin.usage === metadata.pluginUsage.driver);

  const allProjectComponents = project.components.toArray()
    .map(component => {
      const plugin = project.plugins.get(component.plugin);
      return {
        entityId : plugin.entityId,
        component,
        plugin
      };
    })
    .filter(c => c.plugin.usage === metadata.pluginUsage.driver);

  // we deploy each entity in a separate way
  const entityIds = new Set(allProjectComponents.map(c => c.plugin.entityId));

  for(const entityId of entityIds) {
    const entityOnlineComponents  = allOnlineComponents.filter(c => c.entityId === entityId);
    const entityProjectComponents = allProjectComponents.filter(c => c.entityId === entityId);

    const bindingsToDelete   = new Map();
    const componentsToDelete = new Map();
    const componentsToCreate = new Map();

    for(const onlineComponent of entityOnlineComponents) {
      const projectComponent = entityProjectComponents.find(c => c.component.id === onlineComponent.component.id);

      // does not exist anymore
      if(!projectComponent) {
        componentsToDelete.set(onlineComponent.component.id, onlineComponent);
        continue;
      }

      // no changes -> skip
      if(componentsAreSame(onlineComponent, projectComponent)) {
        continue;
      }

      // still exist but changes -> recreate
      componentsToDelete.set(onlineComponent.component.id, onlineComponent);
      componentsToCreate.set(projectComponent.component.id, projectComponent);
    }

    // only new components
    for(const projectComponent of entityProjectComponents) {
      if(entityOnlineComponents.find(c => c.component.id === projectComponent.component.id)) { continue; }

      componentsToCreate.set(projectComponent.component.id, projectComponent);
    }

    for(const compId of componentsToDelete.keys()) {
      // remove bindingTargets
      for(const [id, value] of onlineComponents) {
        for(const binding of value.component.bindings) {
          if(binding.remote_id !== compId) { continue; }

          const bindingId = `${binding.remote_id}.${binding.remote_attribute}->${id}.${binding.local_action}`;
          bindingsToDelete.set(bindingId, {
            entityId        : value.entityId,
            remoteId        : binding.remote_id,
            remoteAttribute : binding.remote_attribute,
            localId         : id,
            localAction     : binding.local_action
          });
        }
      }
    }

    fillOperations(operations, bindingsToDelete, componentsToDelete, componentsToCreate);
  }

  return operations;
}

function createComponent(project, location, plugin) {
  const uid       = newId();
  const component = {
    uid,
    id             : `component_${uid}`,
    bindings       : Immutable.Set(),
    bindingTargets : Immutable.Set(),
    config         : {},
    designer       : { location: snapToGrid(location) },
    plugin
  };

  validateConfig(project, component);
  return component;
}

function canCreateBinding(project, remoteComponentUid, remoteAttributeName, localComponentUid, localActionName) {
  const remoteComponent = project.components.get(remoteComponentUid);
  const localComponent  = project.components.get(localComponentUid);
  const remotePlugin    = project.plugins.get(remoteComponent.plugin);
  const localPlugin     = project.plugins.get(localComponent.plugin);
  const remoteAttribute = remotePlugin.clazz.attributes.find(a => a.name === remoteAttributeName);
  const localAction     = localPlugin.clazz.actions.find(a => a.name === localActionName);

  // check types
  if(localAction.types.length !== 1 || localAction.types[0] !== remoteAttribute.type) {
    return false;
  }

  // cannot bind on self
  if(remoteComponent === localComponent) {
    return false;
  }

  // check if a binding already exists
  for(const binding of project.bindings.values()) {
    if(binding.local === localComponent.uid &&
       binding.remote === remoteComponent.uid &&
       binding.localAction === localAction.name &&
       binding.remoteAttribute === remoteAttribute.name) {
      return false;
    }
  }

  return true;
}

function createBinding(project, remoteComponentUid, remoteAttributeName, localComponentUid, localActionName) {
  return {
    uid             : newId(),
    remote          : remoteComponentUid,
    local           : localComponentUid,
    remoteAttribute : remoteAttributeName,
    localAction     : localActionName
  };
}

function findPlugin(project, entityId, library, type) {
  for(const plugin of project.plugins.values()) {
    if(plugin.entityId === entityId &&
       plugin.library  === library &&
       plugin.type     === type) {
      return plugin;
    }
  }
}

function findComponent(project, componentId) {
  for(const component of project.components.values()) {
    if(component.id === componentId) {
      return component;
    }
  }
}

function findPluginUsage(project, plugin) {
  return project.components.filter(comp => comp.plugin === plugin).valueSeq().toArray();
}

function getProjectPlugins(project) {
  const ret = new Map();
  for(const plugin of project.plugins.values()) {
    ret.set(`${plugin.entityId}:${plugin.library}:${plugin.type}`, {
      entityId: plugin.entityId,
      plugin
    });
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
                     filter(id => onlinePlugins.get(id).plugin.clazz !== projectPlugins.get(id).plugin.raw.clazz)
  };

  ret.count = ret.added.length +
              ret.deleted.length +
              ret.modified.length;

  return ret;
}

function checkPluginsUpToDate(projectPlugins, onlinePlugins) {
  const diff = pluginsDiff(projectPlugins, onlinePlugins);
  if(diff.count) {
    throw new Error('Plugins are outdated');
  }
}

function componentsAreSame(onlineComponent, projectComponent) {
  if(onlineComponent.component.id !== projectComponent.component.id) { return false; }
  if(onlineComponent.entityId !== projectComponent.entityId) { return false; }
  if(onlineComponent.component.library !== projectComponent.plugin.library) { return false; }
  if(onlineComponent.component.type !== projectComponent.plugin.type) { return false; }
  if(!mapAreSame(common.loadMapOnline(onlineComponent.component.config), projectComponent.component.config)) { return false; }
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

function fillOperations(operations, bindingsToDelete, componentsToDelete, componentsToCreate, bindingsToCreate) {

  operations = operations || [];

  for(const value of (bindingsToDelete || new Map()).values()) {
    operations.push(createOperationDeleteBinding(value));
  }

  for(const value of (componentsToDelete || new Map()).values()) {
    operations.push(createOperationDeleteComponent(value));
  }

  for(const value of (componentsToCreate || new Map()).values()) {
    operations.push(createOperationCreateComponent(value));
  }

  for(const value of (bindingsToCreate || new Map()).values()) {
    operations.push(createOperationCreateBinding(value));
  }

  return operations;
}

function createOperationDeleteBinding(value) {
  return {
    uid         : newId(),
    enabled     : true,
    description : `Delete binding ${value.remoteId}.${value.remoteAttribute} -> ${value.localId}.${value.localAction} on entity ${value.entityId}`,
    action      : {
      type : 'deleteBinding',
      ...value
    }
  };
}

function createOperationDeleteComponent(value) {
  return {
    uid         : newId(),
    enabled     : true,
    description : `Delete component ${value.component.id} on entity ${value.entityId}`,
    action      : {
      type : 'deleteComponent',
      ...value
    }
  };
}

function createOperationCreateComponent(value) {
  return {
    uid         : newId(),
    enabled     : true,
    description : `Create component ${value.component.id} on entity ${value.entityId}`,
    action      : {
      type: 'newComponent',
      ...value
    }
  };
}

function createOperationCreateBinding(value) {
  return {
    uid         : newId(),
    enabled     : true,
    description : `Create binding ${value.remoteId}.${value.remoteAttribute} -> ${value.localId}.${value.localAction} on entity ${value.entityId}`,
    action      : {
      type : 'newBinding',
      ...value
    }
  };
}

'use strict';

import Immutable from 'immutable';
import async from 'async';

import storeHandler from '../../compat/store'; // TODO: remove that ?
import Metadata from '../metadata/index';

import AppDispatcher from '../../compat/dispatcher';
import { resourcesEntityQuery } from '../../actions/index';
import { getCoreEntities } from'../../selectors/online';

const metadata = new Metadata(); // TODO: how to use facade ?

export default {
  loadToMap,
  serializeFromMap,
  loadDate,
  serializeDate,
  loadMap,
  serializeMap,
  loadMapOnline,
  loadOnlineCoreEntities,
  getOnlinePlugins,
  getOnlineComponents,
  loadPlugin,
  validate,
  validateHandler,
  checkIds,
  serialize,
  checkSaved,
  executeDeploy
};

function loadToMap(array, mapper) {
  return Immutable.Map(array.map(raw => {
    const obj = mapper(raw);
    return [obj.uid, obj];
  }));
}

function serializeFromMap(map, mapper) {
  return Array.from(map.values()).map(mapper);
}

function loadDate(raw) {
  raw = raw.substr(6, raw.length - 8);
  let tz;
  let tzMin;

  if(raw.includes('-')) {
    raw = raw.split('-');
    tz = '-' + raw[1];
    raw = raw[0];
  }

  if(raw.includes('+')) {
    raw = raw.split('+');
    tz = raw[1];
    raw = raw[0];
  }

  if(tz && tz.length === 4) {
    tzMin = tz.substr(2);
    tz = tz.substr(0, 2);
  }

  const date = new Date(parseInt(raw));
  if(tz) {
    date.setHours(date.getHours() + parseInt(tz));
  }
  if(tzMin) {
    date.setMinutes(date.getMinutes() + parseInt(tzMin));
  }

  return date;
}

function loadPlugin(plugin, entityId) {
  const ret = {
    library : plugin.library,
    type    : plugin.type,
    usage   : plugin.usage,
    version : plugin.version,
    clazz   : metadata.parseClass(plugin.clazz),
    config  : metadata.parseConfig(plugin.config),
    raw     : {
      clazz  : plugin.clazz,
      config : plugin.config
    }
  };
  if(entityId) {
    ret.entityId  = entityId;
  }
  return ret;
}

function serializeDate(value) {
  return `/Date(${value.valueOf()})/`;
}

function loadMap(map) {
  const ret = {};
  for(const item of map) {
    ret[item.Key] = item.Value;
  }
  return ret;
}

function serializeMap(map) {
  return Object.keys(map).map(key => ({ Key: key, Value: map[key] }));
}

function loadMapOnline(map) {
  const ret = {};
  for(const item of map) {
    ret[item.key] = item.value;
  }
  return ret;
}

function loadOnlineCoreEntities(done) {
  const entities = getCoreEntities(storeHandler.getStore().getState());

  const funcs = [];
  for(const entity of entities) {
    funcs.push((cb) => AppDispatcher.dispatch(resourcesEntityQuery(entity, cb)));
  }

  return async.parallel(funcs, done);
}

function getOnlinePlugins(coreEntities) {
  const ret = new Map();
  for(const entity of coreEntities) {
    for(const plugin of entity.plugins) {
      ret.set(`${entity.id}:${plugin.library}:${plugin.type}`, {
        entity,
        plugin
      });
    }
  }
  return ret;
}

function getOnlineComponents(coreEntities) {
  const ret = new Map();
  for(const entity of coreEntities) {
    for(const component of entity.components) {
      ret.set(component.id, {
        entity,
        component
      });
    }
  }
  return ret;
}

function validate(project, msgs) {
  if(!project.name) { msgs.push('No name given'); }
}

function validateHandler(msgs) {
  if(!msgs.length) { return; }

  const text = ['Project is not valid:'].concat(msgs.map(m => ` - ${m}`)).join('\n');
  throw new Error(text);
}

function checkIds(map, idAccessor) {
  if(!idAccessor) { idAccessor = obj => obj.id; }
  const ids = new Set();
  const duplicates = new Set();
  let noIdCount = 0;
  for(const obj of map.values()) {
    const id = idAccessor(obj);
    if(!id) {
      ++noIdCount;
      continue;
    }

    if(ids.has(id)) {
      duplicates.add(id);
      continue;
    }

    ids.add(id);
  }

  return {
    noIdCount,
    duplicates
  };
}

function serialize(project) {
  return {
    Name         : project.name,
    CreationDate : serializeDate(project.creationDate),
    LastUpdate   : serializeDate(project.lastUpdate)
  };
}

function checkSaved(project) {
  if(project.dirty) {
    throw new Error('project must be saved');
  }
}

function executeDeploy(data, done) {
  const operations = data.operations.filter(o => o.enabled);
  console.log('executeDeploy', operations); // eslint-disable-line no-console
  const actions = operations.map(o => o.action);
  async.series(actions, (err) => {
    if(err) { return done(err); }
    return loadOnlineCoreEntities(done);
  });
}

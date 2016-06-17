'use strict';

import async from 'async';

import OnlineStore from '../../stores/online-store'; // TODO: remove that ?
import shared from '../../shared/index';
import Metadata from '../metadata/index';
import Resources from '../resources';

const metadata = new Metadata(); // TODO: how to use facade ?
const resources = new Resources(); // TODO: how to use facade ?

export default {
  dirtify,
  loadDate,
  serializeDate,
  loadMap,
  serializeMap,
  loadMapOnline,
  loadOnlineCoreEntities,
  loadPlugin,
  validate,
  validateHandler,
  serialize
};

function dirtify(project) {
  project.dirty = true;
  project.lastUpdate = new Date();
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
  const entities = OnlineStore.getAll().filter(e => e.type === shared.EntityType.CORE);

  const funcs = [];
  for(const entity of entities) {
    funcs.push((cb) => resources.queryPluginsList(entity.id, cb));
    funcs.push((cb) => resources.queryComponentsList(entity.id, cb));
  }

  async.parallel(funcs, done);
}

function loadPlugin(plugin, entityId) {
  const ret     = Object.assign({}, plugin);
  ret.rawClass  = plugin.clazz;
  ret.rawConfig = plugin.config;
  ret.clazz     = metadata.parseClass(plugin.clazz);
  ret.config    = metadata.parseConfig(plugin.config);
  if(entityId) {
    ret.entityId  = entityId;
  }
  return ret;
}

function validate(project, msgs) {
  if(!project.name) { msgs.push('No name given'); }
}

function validateHandler(msgs) {
  if(!msgs.length) { return; }

  const err = new Error('Project is not valid');
  err.validationErrors = msgs;
  throw err;
}

function serialize(project) {
  project.raw = {
    Name         : project.name,
    CreationDate : serializeDate(project.creationDate),
    LastUpdate   : serializeDate(project.lastUpdate)
  };
}

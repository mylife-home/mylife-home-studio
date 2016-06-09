'use strict';

import async from 'async';

import OnlineStore from '../../stores/online-store'; // TODO: remove that ?
import shared from '../../shared/index';
import Resources from '../resources';

const resources = new Resources(); // TODO: how to use facade ?

export default {
  loadDate,
  loadMap,
  loadMapOnline,
  loadOnlineCoreEntities
};

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

function loadMap(map) {
  const ret = {};
  for(const item of map) {
    ret[item.Key] = item.Value;
  }
  return ret;
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

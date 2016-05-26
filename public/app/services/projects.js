'use strict';

import uuid from 'uuid';
import debugLib from 'debug';
import async from 'async';
import RepositoryActionCreators from '../actions/repository-action-creators';
import OnlineStore from '../stores/online-store'; // TODO: remove that ?

import Metadata from './metadata/index';
import Resources from './resources';

import shared from '../shared/index';

const debug = debugLib('mylife:home:studio:services:projects');

const metadata = new Metadata(); // TODO: how to use facade ?
const resources = new Resources(); // TODO: how to use facade ?

class Projects {
  constructor() {
  }

  new(type) {
    const id = uuid.v4();
    const project = {
      id,
      type,
      name: id,
      createDate: new Date(),
      lastUpdate: new Date(),
      dirty: true
    };

    switch(type) {
      case 'vpanel':
        project.toolbox = [];
        project.components = [];
        break;

      case 'ui':
        break;
    }

    debug('project created', project.id);
    return project;
  }

  open(type, content) {
    const data = JSON.parse(content);
    const id = uuid.v4();
    const project = {
      _raw: data,
      id,
      type,
      name: data.Name,
      creationDate: loadDate(data.CreationDate),
      lastUpdate: loadDate(data.LastUpdate),
      dirty: false
    };

    switch(type) {
      case 'vpanel':
        project.toolbox = data.Toolbox.map(loadToolboxItem);
        project.components = data.Components.map(loadComponent.bind(null, project));
        break;

      case 'ui':
        break;
    }

    debug('project created', project.id);
    return project;
  }

  save(project, serializer, done) {
    try {
      this.validate(project);
    } catch(err) {
      return done(err);
    }

    return done(new Error('not implemented'));
/*
    const data = project._data;
    const content = JSON.stringify(data);
    serializer(project.name, content, (err) => {
      if(err) { return done(err); }
      project._save();
      return done();
    });
*/
  }

  validate(project) {
    const msgs = [];

    if(!project.name) { msgs.push('No name given'); }

    if(!msgs.length) { return; }

    const err = new Error('Project is not valid');
    err.validationErrors = msgs;
    throw err;
  }

/*
WIP: how to connect that with actions ??

  importOnlineToolbox(project, force, cb) {
    return loadOnlineCoreEntities((err) => {
      if(err) { return done(err); }

      console.log('importOnlineToolbox');
      return done();
    });
  }

  importOnlineDriverComponents(project, force, cb) {
    return loadOnlineCoreEntities((err) => {
      if(err) { return done(err); }

      console.log('importOnlineDriverComponents');
      return done();
    });
  }

  deployVPanel(project, force, cb) {
    return loadOnlineCoreEntities((err) => {
      if(err) { return done(err); }

      console.log('deployVPanel');
      return done();
    });
  }

  deployDrivers(project, force, cb) {
    return loadOnlineCoreEntities((err) => {
      if(err) { return done(err); }

      console.log('deployDrivers');
      return done();
    });
  }
*/
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

function loadMap(map) {
  const ret = {};
  for(const item of map) {
    ret[item.Key] = item.Value;
  }
  return ret;
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
    bindings: component.Component.bindings, // TODO
    config: loadMap(component.Component.config),
    designer: loadMap(component.Component.designer),
    plugin: findPlugin(project, component.EntityName, component.Component.library, component.Component.type)
  };
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

function loadOnlineCoreEntities(cb) {
  const entities = OnlineStore.getAll().filter(e => e.type === shared.EntityType.CORE);

  const funcs = [];
  for(const entity of entities) {
    funcs.push((cb) => resources.queryPluginsList(entity.id, cb));
    funcs.push((cb) => resources.queryComponentsList(entity.id, cb));
  }

  async.parallel(array, cb);
}

export default Projects;

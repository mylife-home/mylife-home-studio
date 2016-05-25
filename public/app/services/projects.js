'use strict';

import uuid from 'uuid';
import debugLib from 'debug';
import RepositoryActionCreators from '../actions/repository-action-creators';

import Metadata from './metadata/index';

const debug = debugLib('mylife:home:studio:services:projects');

const metadata = new Metadata();

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

function loadToolboxItem(item) {
  return {
    entityId: item.EntityName,
    plugins: item.Plugins.map(loadPlugin)
  };
}

function loadPlugin(plugin) {
  const ret = Object.assign({}, plugin);
  ret.clazz = metadata.parseClass(plugin.clazz);
  return ret;
}

export default Projects;
'use strict';

import uuid from 'uuid';
import debugLib from 'debug';
import async from 'async';
import RepositoryActionCreators from '../../actions/repository-action-creators';
import OnlineStore from '../../stores/online-store'; // TODO: remove that ?

import Resources from '../resources';

import shared from '../../shared/index';

import vpanel from './vpanel';
import ui from './ui';
import common from './common';

const debug = debugLib('mylife:home:studio:services:projects');

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
        vpanel.createNew(project);
        break;

      case 'ui':
        ui.createNew(project);
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
      creationDate: common.loadDate(data.CreationDate),
      lastUpdate: common.loadDate(data.LastUpdate),
      dirty: false
    };

    switch(type) {
      case 'vpanel':
        vpanel.open(project, data);
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

function loadOnlineCoreEntities(done) {
  const entities = OnlineStore.getAll().filter(e => e.type === shared.EntityType.CORE);

  const funcs = [];
  for(const entity of entities) {
    funcs.push((cb) => resources.queryPluginsList(entity.id, cb));
    funcs.push((cb) => resources.queryComponentsList(entity.id, cb));
  }

  async.parallel(funcs, done);
}

export default Projects;

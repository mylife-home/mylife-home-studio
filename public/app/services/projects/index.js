'use strict';

import uuid from 'uuid';
import debugLib from 'debug';
import RepositoryActionCreators from '../../actions/repository-action-creators';
import ProjectActionCreators from '../../actions/project-action-creators';

import vpanel from './vpanel';
import ui from './ui';
import common from './common';

const debug = debugLib('mylife:home:studio:services:projects');

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
    ProjectActionCreators.load(project);
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
    ProjectActionCreators.load(project);
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

  vpanelPrepareImportOnlineToolbox(project, done) {
    return vpanel.prepareImportToolbox(project, done);
  }

  vpanelExecuteImportOnlineToolbox(data, done) {
    return vpanel.executeImportToolbox(data, (err) => {
      if(err) { return done(err); }
      ProjectActionCreators.refresh(data.project);
      return done();
    });
  }

  vpanelImportOnlineDriverComponents(project, done) {
    return vpanel.importDriverComponents(project, (err) => {
      if(err) { return done(err); }
      ProjectActionCreators.refresh(project);
      return done();
    });
  }

  prepareDeployVPanel(project, done) {
    return common.loadOnlineCoreEntities((err) => {
      if(err) { return done(err); }

      console.log('prepareDeployVPanel');
      return done();
    });
  }

  prepareDeployDrivers(project, done) {
    return common.loadOnlineCoreEntities((err) => {
      if(err) { return done(err); }

      console.log('prepareDeployDrivers');
      return done();
    });
  }

  executeDeployVPanel(project, done) {
    console.log('executeDeployVPanel');
    return done();
  }

  executeDeployDrivers(project, done) {
    console.log('executeDeployDrivers');
    return done();
  }
}

export default Projects;

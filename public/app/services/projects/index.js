'use strict';

import uuid from 'uuid';
import debugLib from 'debug';
import RepositoryActionCreators from '../../actions/repository-action-creators';
import ProjectActionCreators from '../../actions/project-action-creators';
import OnlineStore from '../../stores/online-store'; // TODO: remove that ?
import Resources from '../resources';

import vpanel from './vpanel';
import ui from './ui';
import common from './common';

const resources = new Resources(); // TODO: how to use facade ?

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
      raw: data,
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
        ui.open(project, data);
        break;
    }

    debug('project created', project.id);
    ProjectActionCreators.load(project);
    return project;
  }

  dirtify(project) {
    common.dirtify(project);
    ProjectActionCreators.refresh(project);
  }

  validate(project) {
    const msgs = [];

    switch(project.type) {
      case 'vpanel':
        vpanel.validate(project, msgs);
        break;

      case 'ui':
        ui.validate(project, msgs);
        break;
    }

    common.validateHandler(msgs);
  }

  saveOnline(project, done) {
    const key = `project.${project.type}.${project.name}`;
    const entityId = OnlineStore.getResourceEntity().id;
    let content;
    try {
      content = this.serialize(project);
    } catch(err) {
      return done(err);
    }

    return resources.queryResourceSet(entityId, key, content, (err) => {
      if(err) { return done(err); }

      project.dirty = false;
      debug('project saved', project.id);
      ProjectActionCreators.refresh(project);
      return done();
    });
  }

  serialize(project) {
    this.validate(project);

    switch(project.type) {
      case 'vpanel':
        vpanel.serialize(project);
        break;

      case 'ui':
        ui.serialize(project);
        break;
    }

    return JSON.stringify(project.raw);
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

  vpanelPrepareDeployVPanel(project, done) {
    return vpanel.prepareDeployVPanel(project, done);
  }

  vpanelPrepareDeployDrivers(project, done) {
    return vpanel.prepareDeployDrivers(project, done);
  }

  vpanelExecuteDeploy(data, done) {
    return vpanel.executeDeploy(data, (err) => {
      if(err) { return done(err); }
      ProjectActionCreators.refresh(data.project);
      return done();
    });
  }

  vpanelCreateComponent(project, location, pluginData) {
    vpanel.createComponent(project, location, pluginData);
    ProjectActionCreators.refresh(project);
  }
}

export default Projects;

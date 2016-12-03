'use strict';

import uuid from 'uuid';
import debugLib from 'debug';
import OnlineStore from '../../stores/online-store'; // TODO: remove that ?

import AppDispatcher from '../../dispatcher/app-dispatcher';
import { projectRefresh, projectLoad, resourcesSetQuery } from '../../actions/index';

import vpanel from './vpanel';
import ui from './ui';
import common from './common';

const debug = debugLib('mylife:home:studio:services:projects');

class Projects {
  constructor() {
  }

  new(type) {
    const uid = uuid.v4();
    const project = {
      uid,
      type,
      name: uid,
      creationDate: new Date(),
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

    debug('project created', project.uid);
    AppDispatcher.dispatch(projectLoad(project));
    return project;
  }

  open(type, content, internal) {
    const data = JSON.parse(content);
    const uid = uuid.v4();
    const project = {
      raw: data,
      uid,
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

    debug('project created', project.uid);
    if(!internal) { AppDispatcher.dispatch(projectLoad(project)); }
    return project;
  }

  dirtify(project) {
    common.dirtify(project);
    AppDispatcher.dispatch(projectRefresh(project));
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

    return resourcesSetQuery(entityId, key, content, (err) => {
      if(err) { return done(err); }

      project.dirty = false;
      debug('project saved', project.uid);
      AppDispatcher.dispatch(projectRefresh(project));
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

  executeDeploy(data, done) {
    return common.executeDeploy(data, (err) => {
      if(err) { return done(err); }
      AppDispatcher.dispatch(projectRefresh(data.project));
      return done();
    });
  }

  // -----------------------------------------------------------------------------

  vpanelPrepareImportOnlineToolbox(project, done) {
    return vpanel.prepareImportToolbox(project, done);
  }

  vpanelExecuteImportOnlineToolbox(data, done) {
    return vpanel.executeImportToolbox(data, (err) => {
      if(err) { return done(err); }
      AppDispatcher.dispatch(projectRefresh(data.project));
      return done();
    });
  }

  vpanelImportOnlineDriverComponents(project, done) {
    return vpanel.importDriverComponents(project, (err) => {
      if(err) { return done(err); }
      AppDispatcher.dispatch(projectRefresh(project));
      return done();
    });
  }

  vpanelPrepareDeployVPanel(project, done) {
    return vpanel.prepareDeployVPanel(project, done);
  }

  vpanelPrepareDeployDrivers(project, done) {
    return vpanel.prepareDeployDrivers(project, done);
  }

  vpanelCreateComponent(project, location, pluginData) {
    const component = vpanel.createComponent(project, location, pluginData);
    AppDispatcher.dispatch(projectRefresh(project));
    return component;
  }

  vpanelCanCreateBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName) {
    return vpanel.canCreateBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName);
  }

  vpanelCreateBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName) {
    const binding = vpanel.createBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName);
    AppDispatcher.dispatch(projectRefresh(project));
    return binding;
  }

  vpanelDeleteComponent(project, component) {
    vpanel.deleteComponent(project, component);
    AppDispatcher.dispatch(projectRefresh(project));
  }

  vpanelDeleteBinding(project, binding) {
    vpanel.deleteBinding(project, binding);
    AppDispatcher.dispatch(projectRefresh(project));
  }

  vpanelDirtifyComponent(project, component) {
    vpanel.dirtifyComponent(project, component);
    this.dirtify(project);
  }

  vpanelGetComponentHash(project, component) {
    return vpanel.getComponentHash(project, component);
  }

  // -----------------------------------------------------------------------------

  uiPrepareImportOnline(project, done) {
    return ui.prepareImportOnline(project, done);
  }

  uiPrepareImportVpanelProject(project, vpanelProject) {
    return ui.prepareImportVpanelProject(project, vpanelProject);
  }

  uiExecuteImport(data) {
    ui.executeImport(data);
    AppDispatcher.dispatch(projectRefresh(data.project));
  }

  uiPrepareDeploy(project, done) {
    return ui.prepareDeploy(project, done);
  }

  uiCreateImage(project) {
    const image = ui.createImage(project);
    AppDispatcher.dispatch(projectRefresh(project));
    return image;
  }

  uiCreateWindow(project) {
    const window = ui.createWindow(project);
    AppDispatcher.dispatch(projectRefresh(project));
    return window;
  }

  uiCreateControl(project, window, location, type) {
    const control = ui.createControl(project, window, location, type);
    AppDispatcher.dispatch(projectRefresh(project));
    return control;
  }

  uiDeleteComponent(project, component) {
    ui.deleteComponent(project, component);
    AppDispatcher.dispatch(projectRefresh(project));
  }

  uiDeleteImage(project, image) {
    ui.deleteImage(project, image);
    AppDispatcher.dispatch(projectRefresh(project));
  }

  uiDeleteWindow(project, window) {
    ui.deleteWindow(project, window);
    AppDispatcher.dispatch(projectRefresh(project));
  }

  uiDeleteControl(project, window, control) {
    ui.deleteControl(project, window, control);
    AppDispatcher.dispatch(projectRefresh(project));
  }

  uiChangeImage(project, image, data) {
    ui.changeImage(project, image, data);
    AppDispatcher.dispatch(projectRefresh(project));
  }

  uiCreateTextContextItem() {
    return ui.createTextContextItem();
  }

  uiCreateDisplayMappingItem() {
    return ui.createDisplayMappingItem();
  }
}

export default Projects;

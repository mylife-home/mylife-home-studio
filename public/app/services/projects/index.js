'use strict';

import debugLib from 'debug';

import AppDispatcher from '../../compat/dispatcher';
import { projectRefresh, resourcesSetQuery } from '../../actions/index';
import { projectTypes } from '../../constants/index';
import { newId } from '../../utils/index';
import storeHandler from '../../compat/store'; // TODO: remove that ?
import { getResourceEntity } from'../../selectors/online';

import vpanel from './vpanel';
import ui from './ui';
import common from './common';

const debug = debugLib('mylife:home:studio:services:projects');

class Projects {
  constructor() {
  }

  new(type) {

    const specifics = {
      [projectTypes.VPANEL] : () => vpanel.createNew(),
      [projectTypes.UI]     : () => ui.createNew()
    };

    const uid = newId();
    const project = {
      uid,
      type,
      name         : uid,
      creationDate : new Date(),
      lastUpdate   : new Date(),
      dirty        : true,
      ... specifics[type]()
    };

    debug('project created', project.uid);
    return project;
  }

  open(type, content) {
    const data = JSON.parse(content);

    const specifics = {
      [projectTypes.VPANEL] : () => vpanel.open(data),
      [projectTypes.UI]     : () => ui.open(data)
    };

    const project = {
      uid          : newId(),
      type,
      name         : data.Name,
      creationDate : common.loadDate(data.CreationDate),
      lastUpdate   : common.loadDate(data.LastUpdate),
      dirty        : false,
      ... specifics[type]()
    };

    debug('project opened', project.uid);
    return project;
  }

  dirtify(project) {
    common.dirtify(project);
    AppDispatcher.dispatch(projectRefresh(project));
  }

  validate(project) {
    const msgs = [];

    switch(project.type) {
      case projectTypes.VPANEL:
        vpanel.validate(project, msgs);
        break;

      case projectTypes.UI:
        ui.validate(project, msgs);
        break;
    }

    common.validateHandler(msgs);
  }

  saveOnline(project, done) {
    const key = `project.${project.type}.${project.name}`;
    const entityId = getResourceEntity(storeHandler.getStore().getState()).id;
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
      case projectTypes.VPANEL:
        return JSON.stringify(vpanel.serialize(project));

      case projectTypes.UI:
        return JSON.stringify(ui.serialize(project));
    }
  }

  executeDeploy(data, done) {
    return common.executeDeploy(data, done);
  }

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

  vpanelCreateComponent(project, location, plugin) {
    return vpanel.createComponent(project, location, plugin);
  }

  vpanelCanCreateBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName) {
    return vpanel.canCreateBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName);
  }

  vpanelCreateBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName) {
    const binding = vpanel.createBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName);
    AppDispatcher.dispatch(projectRefresh(project));
    return binding;
  }

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

  uiCreateImage() {
    return ui.createImage();
  }

  uiCreateWindow() {
    return ui.createWindow();
  }

  uiCreateControl(project, window, location, type) {
    const control = ui.createControl(project, window, location, type);
    AppDispatcher.dispatch(projectRefresh(project));
    return control;
  }

  uiCheckComponentUsage(project, component) {
    ui.checkComponentUsage(project, component);
  }

  uiCheckImageUsage(project, image) {
    ui.checkImageUsage(project, image);
  }

  uiCheckWindowUsage(project, window) {
    ui.checkWindowUsage(project, window);
  }
}

export default Projects;

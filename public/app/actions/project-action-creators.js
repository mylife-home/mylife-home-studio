'use strict';

import async from 'async';
import { actionTypes, projectTypes } from '../constants/index';
import Facade from '../services/facade';

import { download } from '../utils/index';

import { dialogError, dialogInfo, dialogSetBusy, dialogUnsetBusy, dialogOpenOperations } from './dialog-action-creators';
import { resourcesGet, resourcesSet } from './resources-action-creators';
import { getResourceEntity } from '../selectors/online';
import { getProjects, getProject, getProjectState } from '../selectors/projects';
import { getWindow, getPendingImportComponents } from '../selectors/ui-projects';
import { getComponent, getBinding, getPendingImportToolbox } from '../selectors/vpanel-projects';

export function projectNew(type) {
  const project = Facade.projects.new(type);
  return projectLoad(project);
}

export function projectLoadFile(file, type) {
  return (dispatch) => {
    const reader = new FileReader();

    dispatch(dialogSetBusy('Loading project'));

    reader.onloadend = () => {
      dispatch(dialogUnsetBusy());
      const err = reader.error;
      if(err) { return dispatch(dialogError(err)); }
      const content = reader.result;
      let project;
      try {
        project = Facade.projects.open(type, content);
      } catch(err) {
        return dispatch(dialogError(err));
      }
      dispatch(projectLoad(project));
    };

    reader.readAsText(file);
  };
}

export function projectLoadOnline(resource, type) {
  return (dispatch, getState) => {
    function load(content) {
      let project;
      try {
        project = Facade.projects.open(type, content);
      } catch(err) {
        return dispatch(dialogError(err));
      }
      dispatch(projectLoad(project));
    }

    const entity = getResourceEntity(getState());
    const cachedContent = entity.cachedResources && entity.cachedResources[resource];
    if(cachedContent) {
      return load(cachedContent);
    }

    dispatch(dialogSetBusy('Loading project'));
    return dispatch(resourcesGet(entity.id, resource, (err, content) => {
      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }
      return load(content);
    }));
  };
}

export function projectLoad(project) {
  return {
    type: actionTypes.PROJECT_LOAD,
    project
  };
}

export function projectSaveOnline(project) {
  return (dispatch) => {
    let content;
    try {
      content = Facade.projects.serialize(project);
    } catch(err) {
      return dispatch(dialogError(err));
    }

    dispatch(dialogSetBusy('Saving project'));
    const key = `project.${project.type}.${project.name}`;
    return dispatch(resourcesSet(key, content, (err) => {
      dispatch(dialogUnsetBusy());

      if(err) { return dispatch(dialogError(err)); }
      dispatch(projectSaved({ project: project.uid }));
    }));
  };
}

export function projectSaveAs(project) {
  return (dispatch) => {
    let content;
    try {
      content = Facade.projects.serialize(project);
    } catch(err) {
      return dispatch(dialogError(err));
    }

    download(content, 'application/json', project.name + '.json');
  };
}

export function projectSaveAllOnline() {
  return (dispatch, getState) => {
    const projects = getProjects(getState()).filter(project => project.dirty);
    dispatch(dialogSetBusy('Saving projects'));
    async.eachSeries(projects, (project, cb) => {
      let content;
      try {
        content = Facade.projects.serialize(project);
      } catch(err) {
        return cb(err);
      }

      const key = `project.${project.type}.${project.name}`;
      return dispatch(resourcesSet(key, content, (err) => {

        if(err) { return cb(err); }
        dispatch(projectSaved({ project: project.uid }));
        return cb();
      }));
    }, (err) => {
      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }
    });
  };
}

export function projectClose(project) {
  return {
    type: actionTypes.PROJECT_CLOSE,
    project
  };
}

export function projectSaved(project) {
  return {
    type: actionTypes.PROJECT_SAVED,
    project
  };
}

export function projectUiImportOnline(project) {
  return (dispatch, getState) => {
    dispatch(dialogSetBusy('Preparing import'));

    const state = getState();
    const projectObject = getProject(state, { project });

    Facade.projects.uiPrepareImportOnline(projectObject, (err, data) => {
      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }

      return dispatch(projectUiImportPostPrepare(project, data));
    });
  };
}

// TODO: merge with projectLoadFile
export function projectUiImportVPanelProjectFile(project, file) {
  return (dispatch) => {
    const reader = new FileReader();

    dispatch(dialogSetBusy('Loading project'));

    reader.onloadend = () => {
      dispatch(dialogUnsetBusy());
      const err = reader.error;
      if(err) { return dispatch(dialogError(err)); }
      return dispatch(projectUiImportVPanelProject(project, reader.result));
    };

    reader.readAsText(file);
  };
}

// TODO: merge with projectLoadOnline
export function projectUiImportVPanelProjectOnline(project, name) {
  return (dispatch, getState) => {
    const resource = 'project.vpanel.' + name;

    const entity = getResourceEntity(getState());
    const cachedContent = entity.cachedResources && entity.cachedResources[resource];
    if(cachedContent) {
      return dispatch(projectUiImportVPanelProject(project, cachedContent));
    }

    dispatch(dialogSetBusy('Loading project'));
    return dispatch(resourcesGet(entity.id, resource, (err, content) => {
      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }
      return dispatch(projectUiImportVPanelProject(project, content));
    }));
  };
}

function projectUiImportVPanelProject(project, content) {
  return (dispatch, getState) => {

    let vpanelProject;
    try {
      vpanelProject = Facade.projects.open(projectTypes.VPANEL, content);
    } catch(err) {
      return dispatch(dialogError(err));
    }

    const state = getState();
    const projectObject = getProject(state, { project });

    let data;
    try {
      data = Facade.projects.uiPrepareImportVpanelProject(projectObject, vpanelProject);
    } catch(err) {
      return dispatch(dialogError(err));
    }

    return dispatch(projectUiImportPostPrepare(project, data));
  };
}

function projectUiImportPostPrepare(project, data) {
  return (dispatch) => {
    if(data.messages && data.messages.length) {
      return dispatch(projectUiSetPendingImportComponents(project, data));
    }

    return dispatch(projectUiExecuteImportComponents(project, data));
  };
}

function projectUiExecuteImportComponents(project, data) {
  return (dispatch) => {

    const executors = {
      deleteControlAction           : (op) => dispatch(projectControlChangeAction(project, op.window, op.control, op.action, null)),
      deleteControlContext          : (op) => dispatch(projectControlDeleteTextContext(project, op.window, op.control, op.context)),
      deleteControlDisplayComponent : (op) => dispatch(projectControlChangeDisplayComponent(project, op.window, op.control, null, null)),
      setComponentPlugin            : (op) => dispatch({ type: actionTypes.PROJECT_COMPONENT_SET_PLUGIN, project, component: op.component, plugin: op.plugin }),
      newComponent                  : (op) => dispatch({ type: actionTypes.PROJECT_NEW_COMPONENT, project, component: op.component })
    };

    for(const operation of data.operations) {
      executors[operation.type](operation);
    }

    dispatch(dialogInfo({ title: 'Success', lines: ['Components imported'] }));
  };
}

function projectUiSetPendingImportComponents(project, data) {
  return {
    type: actionTypes.PROJECT_STATE_UI_PENDING_IMPORT_COMPONENTS,
    project,
    data
  };
}

export function projectUiCancelImportComponents(project) {
  return projectUiSetPendingImportComponents(project, null);
}

export function projectUiConfirmImportComponents(project) {
  return (dispatch, getState) => {
    const data = getPendingImportComponents(getState(), { project });
    dispatch(projectUiSetPendingImportComponents(project, null));
    dispatch(projectUiExecuteImportComponents(project, data));
  };
}

export function projectUiPrepareDeploy(project) {
  return (dispatch, getState) => {

    const state = getState();
    const projectObject = getProject(state, { project });

    dispatch(dialogSetBusy('Preparing deploy'));
    Facade.projects.uiPrepareDeploy(projectObject, (err, operations) => {
      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }

      dispatch(dialogOpenOperations(operations));
    });

  };
}

export function projectVPanelImportOnlineToolbox(project) {
  return (dispatch, getState) => {
    const state = getState();
    const projectObject = getProject(state, { project });

    dispatch(dialogSetBusy('Preparing import'));

    Facade.projects.vpanelPrepareImportOnlineToolbox(projectObject, (err, data) => {

      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }

      if(data.messages && data.messages.length) {
        return dispatch(projectVPanelSetPendingImportToolbox(project, data));
      }

      return dispatch(projectVPanelExecuteImportToolbox(project, data));
    });
  };
}

function projectVPanelSetPendingImportToolbox(project, data) {
  return {
    type: actionTypes.PROJECT_STATE_VPANEL_PENDING_IMPORT_TOOLBOX,
    project,
    data
  };
}

export function projectVPanelConfirmImportToolbox(project) {
  return (dispatch, getState) => {
    const data = getPendingImportToolbox(getState(), { project });
    dispatch(projectVPanelSetPendingImportToolbox(project, null));
    dispatch(projectVPanelExecuteImportToolbox(project, data));
  };
}

export function projectVPanelCancelImportToolbox(project) {
  return projectVPanelSetPendingImportToolbox(project, null);
}

function projectVPanelExecuteImportToolbox(project, data) {
  return (dispatch) => {

    const executors = {
      deleteComponent : (op) => dispatch(projectDeleteVPanelComponent(project, op.component)),
      deletePlugin    : (op) => dispatch({ type: actionTypes.PROJECT_DELETE_PLUGIN, project, plugin: op.plugin }),
      newPlugin       : (op) => dispatch({ type: actionTypes.PROJECT_NEW_PLUGIN, project, plugin: op.plugin })
    };

    for(const operation of data.operations) {
      executors[operation.type](operation);
    }

    dispatch(dialogInfo({ title: 'Success', lines: ['Toolbox imported'] }));
  };
}

export function projectVPanelImportOnlineDriverComponents(project) {
  return (dispatch, getState) => {
    const state = getState();
    const projectObject = getProject(state, { project });

    dispatch(dialogSetBusy('Executing import'));

    Facade.projects.vpanelImportOnlineDriverComponents(projectObject, (err, components) => {
      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }

      let lastComponent;

      for(const component of components) {
        dispatch({
          type: actionTypes.PROJECT_NEW_COMPONENT,
          project,
          component
        });

        lastComponent = component;
      }

      if(lastComponent) {
        const selection = { type: 'component', uid: lastComponent.uid };
        dispatch(projectStateSelect(project, selection));
      }

      dispatch(dialogInfo({ title: 'Success', lines: ['Components imported'] }));
    });
  };
}

export function projectVPanelPrepareDeployVPanel(project) {
  return (dispatch, getState) => {

    const state = getState();
    const projectObject = getProject(state, { project });

    dispatch(dialogSetBusy('Preparing deploy'));
    Facade.projects.vpanelPrepareDeployVPanel(projectObject, (err, operations) => {
      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }

      dispatch(dialogOpenOperations(operations));
    });

  };
}

export function projectVPanelPrepareDeployDrivers(project) {
  return (dispatch, getState) => {

    const state = getState();
    const projectObject = getProject(state, { project });

    dispatch(dialogSetBusy('Preparing deploy'));
    Facade.projects.vpanelPrepareDeployDrivers(projectObject, (err, operations) => {
      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }

      dispatch(dialogOpenOperations(operations));
    });

  };
}

export function projectChangeName(project, newName) {
  return {
    type: actionTypes.PROJECT_CHANGE_NAME,
    project,
    newName
  };
}

export function projectNewComponent(project, location, plugin) {
  return (dispatch, getState) => {
    const state = getState();
    const projectObject = getProject(state, { project });
    const component = Facade.projects.vpanelCreateComponent(projectObject, location, plugin);
    dispatch({
      type: actionTypes.PROJECT_NEW_COMPONENT,
      project,
      component
    });

    const selection = { type: 'component', uid: component.uid };
    dispatch(projectStateSelect(project, selection));
  };
}

export function projectDeleteVPanelComponent(project, component) {
  return (dispatch, getState) => {
    // delete bindings
    const state = getState();
    const comp = getComponent(state, { project, component });

    for(const binding of comp.bindings) {
      dispatch(projectDeleteBinding(project, binding));
    }
    for(const binding of comp.bindingTargets) {
      dispatch(projectDeleteBinding(project, binding));
    }

    dispatch({
      type: actionTypes.PROJECT_DELETE_VPANEL_COMPONENT,
      project,
      component
    });

    dispatch(projectStateSelect(project, null));
  };
}

export function projectComponentChangeId(project, component, id) {
  return {
    type: actionTypes.PROJECT_COMPONENT_CHANGE_ID,
    project,
    component,
    id
  };
}

export function projectMoveComponent(project, component, location) {
  return {
    type: actionTypes.PROJECT_MOVE_COMPONENT,
    project,
    component,
    location
  };
}

export function projectComponentChangeConfig(project, component, name, value) {
  return {
    type: actionTypes.PROJECT_COMPONENT_CHANGE_CONFIG,
    project,
    component,
    name,
    value
  };
}

export function projectNewBinding(project, remoteComponent, remoteAttributeName, localComponent, localActionName) {
  return (dispatch) => {
    const binding = Facade.projects.vpanelCreateBinding(project, remoteComponent, remoteAttributeName, localComponent, localActionName);

    dispatch({
      type: actionTypes.PROJECT_NEW_BINDING,
      project,
      binding
    });

    dispatch(projectStateSelect(project, {
      type: 'binding',
      uid: binding.uid
    }));
  };
}

export function projectDeleteBinding(project, binding) {
  return (dispatch, getState) => {

    const bindingObject = getBinding(getState(), { project, binding });

    dispatch(projectStateSelect(project, null));

    dispatch({
      type   : actionTypes.PROJECT_DELETE_BINDING,
      project,
      binding,
      remote : bindingObject.remote,
      local  : bindingObject.local
    });
  };
}

export function projectDeleteUiComponent(project, component) {
  return (dispatch, getState) => {
    const state = getState();
    try {
      Facade.projects.uiCheckComponentUsage(getProject(state, { project }), component);
    } catch(err) {
      return dispatch(dialogError(err));
    }

    dispatch(projectStateSelectAndActiveContent(project, null, null));

    dispatch({
      type: actionTypes.PROJECT_DELETE_UI_COMPONENT,
      project,
      component
    });
  };
}

export function projectNewImage(project) {
  return (dispatch) => {
    const image = Facade.projects.uiCreateImage();
    dispatch({
      type: actionTypes.PROJECT_NEW_IMAGE,
      project,
      image
    });

    const selection = { type: 'image', uid: image.uid };
    dispatch(projectStateSelectAndActiveContent(project, selection, selection));
  };
}

export function projectDeleteImage(project, image) {
  return (dispatch, getState) => {
    const state = getState();
    try {
      Facade.projects.uiCheckImageUsage(getProject(state, { project }), image);
    } catch(err) {
      return dispatch(dialogError(err));
    }

    dispatch(projectStateSelectAndActiveContent(project, null, null));

    dispatch({
      type: actionTypes.PROJECT_DELETE_IMAGE,
      project,
      image
    });
  };
}

export function projectImageChangeFile(project, image, file) {
  return (dispatch) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const err = reader.error;
      if(err) { return dispatch(dialogError(err)); }

      let data = reader.result;
      const marker = 'base64,';
      const start = data.indexOf(marker) + marker.length;
      data = data.substring(start);

      dispatch({
        type: actionTypes.PROJECT_IMAGE_CHANGE_DATA,
        project,
        image,
        data
      });
    };

    reader.readAsDataURL(file);
  };
}

export function projectImageChangeId(project, image, id) {
  return {
    type: actionTypes.PROJECT_IMAGE_CHANGE_ID,
    project,
    image,
    id
  };
}

export function projectChangeDefaultWindow(project, window) {
  return {
    type: actionTypes.PROJECT_CHANGE_DEFAULT_WINDOW,
    project,
    window
  };
}

export function projectNewWindow(project) {
  return (dispatch) => {
    const window = Facade.projects.uiCreateWindow();
    dispatch({
      type: actionTypes.PROJECT_NEW_WINDOW,
      project,
      window
    });

    const selection = { type: 'window', uid: window.uid };
    dispatch(projectStateSelectAndActiveContent(project, selection, selection));
  };
}

export function projectDeleteWindow(project, window) {
  return (dispatch, getState) => {
    const state = getState();
    try {
      Facade.projects.uiCheckWindowUsage(getProject(state, { project }), window);
    } catch(err) {
      return dispatch(dialogError(err));
    }

    dispatch(projectStateSelectAndActiveContent(project, null, null));

    dispatch({
      type: actionTypes.PROJECT_DELETE_WINDOW,
      project,
      window
    });
  };
}

export function projectWindowChangeId(project, window, id) {
  return {
    type: actionTypes.PROJECT_WINDOW_CHANGE_ID,
    project,
    window,
    id
  };
}

export function projectResizeWindow(project, window, { height, width }) {
  return {
    type: actionTypes.PROJECT_RESIZE_WINDOW,
    project,
    window,
    height,
    width
  };
}

export function projectWindowChangeImage(project, window, image) {
  return {
    type: actionTypes.PROJECT_WINDOW_CHANGE_IMAGE,
    project,
    window,
    image
  };
}

export function projectNewControl(project, location, type) {
  return (dispatch, getState) => {
    const state        = getState();
    const projectState = getProjectState(state, { project });
    const window       = getWindow(state, { window: projectState.activeContent.uid });
    const control      = Facade.projects.uiCreateControl(project, window, location, type);

    dispatch({
      type: actionTypes.PROJECT_NEW_CONTROL,
      project,
      window,
      control
    });

    dispatch(projectStateSelect(project, {
      type: 'control',
      windowUid: window.uid,
      controlUid: control.uid
    }));
  };
}

export function projectDeleteControl(project, window, control) {
  return (dispatch) => {

    dispatch(projectStateSelect(project, { type: 'window', uid: window }));

    dispatch({
      type: actionTypes.PROJECT_DELETE_CONTROL,
      project,
      window,
      control
    });
  };
}

export function projectMoveControl(project, window, control, position) {
  return {
    type: actionTypes.PROJECT_MOVE_CONTROL,
    project,
    window,
    control,
    position
  };
}

export function projectResizeControl(project, window, control, size) {
  return {
    type: actionTypes.PROJECT_RESIZE_CONTROL,
    project,
    window,
    control,
    size
  };
}

export function projectControlChangeId(project, window, control, id) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_ID,
    project,
    window,
    control,
    id
  };
}

export function projectControlChangeTextFormat(project, window, control, format) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_TEXT_FORMAT,
    project,
    window,
    control,
    format
  };
}

export function projectControlAddTextContext(project, window, control, newItem) {
  return {
    type: actionTypes.PROJECT_CONTROL_ADD_TEXT_CONTEXT,
    project,
    window,
    control,
    newItem
  };
}

export function projectControlDeleteTextContext(project, window, control, item) {
  return {
    type: actionTypes.PROJECT_CONTROL_DELETE_TEXT_CONTEXT,
    project,
    window,
    control,
    item
  };
}

export function projectControlChangeTextContextId(project, window, control, item, id) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_TEXT_CONTEXT_ID,
    project,
    window,
    control,
    item,
    id
  };
}

export function projectControlChangeTextContextComponent(project, window, control, item, component, attribute) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_TEXT_CONTEXT_COMPONENT,
    project,
    window,
    control,
    item,
    component,
    attribute
  };
}

export function projectControlChangeDisplayComponent(project, window, control, component, attribute) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_COMPONENT,
    project,
    window,
    control,
    component,
    attribute
  };
}

export function projectControlChangeDisplayMappingImage(project, window, control, item, image) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_MAPPING_IMAGE,
    project,
    window,
    control,
    item,
    image
  };
}

export function projectControlChangeDisplayMappingValue(project, window, control, item, value) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_MAPPING_VALUE,
    project,
    window,
    control,
    item,
    value
  };
}

export function projectControlChangeDisplayMappingMin(project, window, control, item, min) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_MAPPING_MIN,
    project,
    window,
    control,
    item,
    min
  };
}

export function projectControlChangeDisplayMappingMax(project, window, control, item, max) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_MAPPING_MAX,
    project,
    window,
    control,
    item,
    max
  };
}

export function projectControlAddDisplayMapping(project, window, control, newItem) {
  return {
    type: actionTypes.PROJECT_CONTROL_ADD_DISPLAY_MAPPING,
    project,
    window,
    control,
    newItem
  };
}

export function projectControlDeleteDisplayMapping(project, window, control, item) {
  return {
    type: actionTypes.PROJECT_CONTROL_DELETE_DISPLAY_MAPPING,
    project,
    window,
    control,
    item
  };
}

export function projectControlChangeImage(project, window, control, image) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_IMAGE,
    project,
    window,
    control,
    image
  };
}

export function projectControlChangeAction(project, window, control, actionType, action) {
  return {
    type: actionTypes.PROJECT_CONTROL_CHANGE_ACTION,
    project,
    window,
    control,
    actionType,
    action
  };
}

export function projectStateSelect(project, selection) {
  if(typeof project === 'object') { project = project.uid; } // TODO: clean
  return {
    type: actionTypes.PROJECT_STATE_SELECT,
    project,
    selection
  };
}

export function projectStateSelectAndActiveContent(project, selection, activeContent) {
  if(typeof project === 'object') { project = project.uid; } // TODO: clean
  return {
    type: actionTypes.PROJECT_STATE_SELECT_AND_ACTIVE_CONTENT,
    project,
    selection,
    activeContent
  };
}

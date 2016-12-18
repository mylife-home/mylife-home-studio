'use strict';

import async from 'async';
import { actionTypes } from '../constants/index';
import Facade from '../services/facade';
import { newId } from '../utils/index';

import AppDispatcher from '../compat/dispatcher';

import { download, snapToGrid } from '../utils/index';

import { dialogError, dialogSetBusy, dialogUnsetBusy } from './dialog-action-creators';
import { resourcesGet } from './resources-action-creators';
import { getProjects, getProject, getProjectState } from '../selectors/projects';
import { getWindow } from '../selectors/ui-projects';
import { getResourceEntity } from '../selectors/online';

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
    dispatch(dialogSetBusy('Saving project'));
    Facade.projects.saveOnline(project, (err) => {
      dispatch(dialogUnsetBusy());
      if(err) { return dispatch(dialogError(err)); }
    });
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
    const projects = getProjects(getState());
    dispatch(dialogSetBusy('Saving projects'));
    async.eachSeries(projects, (project, cb) => Facade.projects.saveOnline(project, cb), (err) => {
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

export function projectChangeName(project, newName) {
  return {
    type: actionTypes.PROJECT_CHANGE_NAME,
    project,
    newName
  };
}

export function projectNewComponent(project, location, plugin) {

  const component = Facade.projects.vpanelCreateComponent(project, snapToGrid(location), plugin);

  AppDispatcher.dispatch(projectStateSelect(project, { type: 'component', uid: component.uid }));
}

export function projectDeleteComponent(project, component) {
  AppDispatcher.dispatch(projectStateSelect(project, null));
  Facade.projects.vpanelDeleteComponent(project, component);
}

export function projectComponentChangeId(project, component, id) {
  component.id = id;
  Facade.projects.dirtify(project);
}

export function projectMoveComponent(project, component, location) {
  Object.assign(component.designer.location, location);
  Facade.projects.vpanelDirtifyComponent(project, component);
}

export function projectComponentChangeConfig(project, component, name, value) {
  component.config[name] = value;
  Facade.projects.vpanelDirtifyComponent(project, component);
}

export function projectNewBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName) {
  const binding = Facade.projects.vpanelCreateBinding(project, remoteComponentId, remoteAttributeName, localComponentId, localActionName);

  AppDispatcher.dispatch(projectStateSelect(project, {
    type: 'binding',
    uid: binding.uid
  }));
}

export function projectDeleteBinding(project, binding) {
  AppDispatcher.dispatch(projectStateSelect(project, null));
  Facade.projects.vpanelDeleteBinding(project, binding);
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
  control.text.context.push({ ...newItem, uid: newId()});
  Facade.projects.dirtify(project);
}

export function projectControlDeleteTextContext(project, window, control, item) {
  arrayRemoveByValue(control.text.context, item);
  Facade.projects.dirtify(project);
}

export function projectControlChangeTextContextId(project, window, control, item, newId) {
  item.id = newId;
  Facade.projects.dirtify(project);
}

export function projectControlChangeTextContextComponent(project, window, control, item, component, attribute) {
  item.component = component;
  item.attribute = attribute;
  Facade.projects.dirtify(project);
}

export function projectControlChangeDisplayComponent(project, window, control, component, attribute) {
  control.display.component = component;
  control.display.attribute = attribute;
  control.display.map = [];
  Facade.projects.dirtify(project);
}

export function projectControlChangeDisplayMappingImage(project, window, control, item, image) {
  item.resource = image;
  Facade.projects.dirtify(project);
}

export function projectControlChangeDisplayMappingValue(project, window, control, item, newValue) {
  item.value = newValue;
  Facade.projects.dirtify(project);
}

export function projectControlChangeDisplayMappingMin(project, window, control, item, newMin) {
  item.min = newMin;
  Facade.projects.dirtify(project);
}

export function projectControlChangeDisplayMappingMax(project, window, control, item, newMax) {
  item.max = newMax;
  Facade.projects.dirtify(project);
}

export function projectControlAddDisplayMapping(project, window, control, newItem) {
  control.display.map.push({ ...newItem, uid: newId()});
  Facade.projects.dirtify(project);
}

export function projectControlDeleteDisplayMapping(project, window, control, item) {
  arrayRemoveByValue(control.display.map, item);
  Facade.projects.dirtify(project);
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

export function projectRefresh(project) {
  return {
    type: actionTypes.PROJECT_REFRESH,
    project
  };
}

export function projectStateUpdateLinkData(project, linkData) {
  return {
    type: actionTypes.PROJECT_STATE_UPDATE_LINK_DATA,
    project,
    linkData
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


function arrayRemoveByValue(array, item) {
  const index = array.indexOf(item);
  if(index === -1) { return; }
  array.splice(index, 1);
}

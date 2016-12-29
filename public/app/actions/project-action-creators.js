'use strict';

import async from 'async';
import { actionTypes } from '../constants/index';
import Facade from '../services/facade';

import { download } from '../utils/index';

import { dialogError, dialogSetBusy, dialogUnsetBusy } from './dialog-action-creators';
import { resourcesGet, resourcesSet } from './resources-action-creators';
import { getProjects, getProject, getProjectState } from '../selectors/projects';
import { getWindow } from '../selectors/ui-projects';
import { getResourceEntity } from '../selectors/online';
import { getComponent, getBinding } from '../selectors/vpanel-projects';

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

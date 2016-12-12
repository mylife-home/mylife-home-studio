'use strict';

import async from 'async';
import uuid from 'uuid';
import { actionTypes, projectTypes } from '../constants/index';
import Facade from '../services/facade';

import ProjectStore from '../stores/project-store';
import OnlineStore from '../stores/online-store';

import AppDispatcher from '../compat/dispatcher';

import { download, snapToGrid } from '../utils/index';

import { dialogError, dialogSetBusy, dialogUnsetBusy } from './dialog-action-creators';
import { resourcesGet } from './resources-action-creators';

export function projectNew(type) {
  Facade.projects.new(type);
}

export function projectLoadFile(file, type) {

  const reader = new FileReader();

  AppDispatcher.dispatch(dialogSetBusy('Loading project'));

  reader.onloadend = () => {
    AppDispatcher.dispatch(dialogUnsetBusy());
    const err = reader.error;
    if(err) { return AppDispatcher.dispatch(dialogError(err)); }
    const content = reader.result;
    try {
      Facade.projects.open(type, content);
    } catch(err) {
      return AppDispatcher.dispatch(dialogError(err));
    }
  };

  reader.readAsText(file);
}

export function projectLoadOnline(resource, type) {
  function load(content) {
    try {
      Facade.projects.open(type, content);
    } catch(err) {
      return AppDispatcher.dispatch(dialogError(err));
    }
  }

  const entity = OnlineStore.getResourceEntity();
  const cachedContent = entity.cachedResources && entity.cachedResources[resource];
  if(cachedContent) {
    return load(cachedContent);
  }

  // need to get content .. TODO: Flux pattern to do that ?
  AppDispatcher.dispatch(dialogSetBusy('Loading project'));
  return AppDispatcher.dispatch(resourcesGet(entity.id, resource, (err, content) => {
    AppDispatcher.dispatch(dialogUnsetBusy());
    if(err) { return AppDispatcher.dispatch(dialogError(err)); }
    return load(content);
  }));
}

export function projectLoad(project) {
  return {
    type: actionTypes.PROJECT_LOAD,
    project
  };
}

export function projectSaveOnline(project) {
  AppDispatcher.dispatch(dialogSetBusy('Saving project'));
  Facade.projects.saveOnline(project, (err) => {
    AppDispatcher.dispatch(dialogUnsetBusy());
    if(err) { return AppDispatcher.dispatch(dialogError(err)); }
  });
}

export function projectSaveAs(project) {
  let content;
  try {
    content = Facade.projects.serialize(project);
  } catch(err) {
    return AppDispatcher.dispatch(dialogError(err));
  }

  download(content, 'application/json', project.name + '.json');
}

export function projectSaveAllOnline() {
  const projects = ProjectStore.getAll();
  AppDispatcher.dispatch(dialogSetBusy('Saving projects'));
  async.eachSeries(projects, (project, cb) => Facade.projects.saveOnline(project, cb), (err) => {
    AppDispatcher.dispatch(dialogUnsetBusy());
    if(err) { return AppDispatcher.dispatch(dialogError(err)); }
  });
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
  switch(project.type) {
    case projectTypes.VPANEL:
      AppDispatcher.dispatch(projectStateSelect(project, null));
      Facade.projects.vpanelDeleteComponent(project, component);
      break;
    case projectTypes.UI:
      try {
        AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, null, null));
        Facade.projects.uiDeleteComponent(project, component);
      } catch(err) {
        AppDispatcher.dispatch(dialogError(err));
      }
      break;
  }
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

export function projectNewImage(project) {
  const image = Facade.projects.uiCreateImage(project);

  const selection = { type: 'image', uid: image.uid };
  AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, selection, selection));
}

export function projectDeleteImage(project, image) {
  try {
    AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, null, null));
    Facade.projects.uiDeleteImage(project, image);
  } catch(err) {
    AppDispatcher.dispatch(dialogError(err));
  }
}

export function projectImageChangeFile(project, image, file) {

  const reader = new FileReader();

  reader.onloadend = () => {
    const err = reader.error;
    if(err) { return AppDispatcher.dispatch(dialogError(err)); }

    let data = reader.result;
    const marker = 'base64,';
    const start = data.indexOf(marker) + marker.length;
    data = data.substring(start);

    const { project, image } = this.props;
    Facade.projects.uiChangeImage(project, image, data);
  };

  reader.readAsDataURL(file);
}

export function projectImageChangeId(project, image, id) {
  image.id = id;
  Facade.projects.dirtify(project);
}

export function projectChangeDefaultWindow(project, window) {
  project.defaultWindow = window;
  Facade.projects.dirtify(project);
}

export function projectNewWindow(project) {
  const window = Facade.projects.uiCreateWindow(project);

  const selection = { type: 'window', uid: window.uid };
  AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, selection, selection));
}

export function projectDeleteWindow(project, window) {
  try {
    AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, null, null));
    Facade.projects.uiDeleteWindow(project, window);
  } catch(err) {
    AppDispatcher.dispatch(dialogError(err));
  }
}

export function projectWindowChangeId(project, window, id) {
  window.id = id;
  Facade.projects.dirtify(project);
}

export function projectResizeWindow(project, window, newSize) {
  window.height = newSize.height;
  window.width  = newSize.width;
  Facade.projects.dirtify(project);
}

export function projectWindowChangeImage(project, window, newImage) {
  window.backgroundResource = newImage;
  Facade.projects.dirtify(project);
}

export function projectNewControl(project, location, type) {
  const projectState = ProjectStore.getProjectState(project);
  const window = project.windows.find(wnd => wnd.uid === projectState.activeContent.uid);

  const control = Facade.projects.uiCreateControl(project, window, location, type);

  AppDispatcher.dispatch(projectStateSelect(project, {
    type: 'control',
    windowUid: window.uid,
    controlUid: control.uid
  }));
}

export function projectDeleteControl(project, window, control) {
  try {
    AppDispatcher.dispatch(projectStateSelect(project, { type: 'window', uid: window.uid }));

    Facade.projects.uiDeleteControl(project, window, control);
  } catch(err) {
    AppDispatcher.dispatch(dialogError(err));
  }
}

export function projectMoveControl(project, window, control, newPosition) {
  control.x = newPosition.x;
  control.y = newPosition.y;
  Facade.projects.dirtify(project);
}

export function projectResizeControl(project, window, control, newSize) {
  control.height = newSize.height;
  control.width  = newSize.width;
  Facade.projects.dirtify(project);
}

export function projectControlChangeId(project, window, control, id) {
  control.id = id;
  Facade.projects.dirtify(project);
}

export function projectControlChangeTextFormat(project, window, control, format) {
  control.text.format = format;
  Facade.projects.dirtify(project);
}

export function projectControlAddTextContext(project, window, control, newItem) {
  control.text.context.push({ ...newItem, uid: uuid.v4()});
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

export function projectControlChangeDisplayMappingImage(project, window, control, item, newImage) {
  item.resource = newImage;
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
  control.display.map.push({ ...newItem, uid: uuid.v4()});
  Facade.projects.dirtify(project);
}

export function projectControlDeleteDisplayMapping(project, window, control, item) {
  arrayRemoveByValue(control.display.map, item);
  Facade.projects.dirtify(project);
}

export function projectControlChangeImage(project, window, control, newImage) {
  control.display.defaultResource = newImage;
  Facade.projects.dirtify(project);
}

export function projectControlChangeAction(project, window, control, actionType, newAction) {
  control[actionType] = newAction;
  Facade.projects.dirtify(project);
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
  return {
    type: actionTypes.PROJECT_STATE_SELECT,
    project,
    selection
  };
}

export function projectStateSelectAndActiveContent(project, selection, activeContent) {
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

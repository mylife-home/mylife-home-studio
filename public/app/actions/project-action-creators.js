'use strict';

import async from 'async';
import AppConstants from '../constants/app-constants';
import Facade from '../services/facade';

import ProjectStore from '../stores/project-store';
import OnlineStore from '../stores/online-store';

import AppDispatcher from '../compat/dispatcher';

import { download, snapToGrid } from '../utils/index';

import { dialogError, dialogSetBusy, dialogUnsetBusy } from './dialog-action-creators';
import { resourcesGetQuery } from './resources-action-creators';

export function projectNew(type) {
  try {
    Facade.projects.new(type);
  } catch(err) {
    return AppDispatcher.dispatch(dialogError(err));
  }
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
  return resourcesGetQuery(entity.id, resource, (err, content) => {
    AppDispatcher.dispatch(dialogUnsetBusy());
    if(err) { return AppDispatcher.dispatch(dialogError(err)); }
    return load(content);
  });
}

export function projectLoad(project) {
  return {
    type: AppConstants.ActionTypes.PROJECT_LOAD,
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
    type: AppConstants.ActionTypes.PROJECT_CLOSE,
    project
  };
}

export function projectChangeName(project, name) {
  project.name = name;
  Facade.projects.dirtify(project);
}

export function projectNewComponent(project, location, plugin) {

  const component = Facade.projects.vpanelCreateComponent(project, snapToGrid(location), plugin);

  AppDispatcher.dispatch(projectStateSelect(project, { type: 'component', uid: component.uid }));
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

export function projectDeleteComponent(project, component) {
  switch(project.type) {
    case 'vpanel':
      Facade.projects.vpanelDeleteComponent(project, component);
      break;
    case 'ui':
      Facade.projects.uiDeleteComponent(project, component);
      break;
  }
}

export function projectDeleteBinding(project, binding) {
  Facade.projects.vpanelDeleteBinding(project, binding);
}

export function projectNewImage(project) {
  const image = Facade.projects.uiCreateImage(project);

  const selection = { type: 'image', uid: image.uid };
  AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, selection, selection));
}

export function projectImageChangeId(project, image, id) {
  image.id = id;
  Facade.projects.dirtify(project);
}

export function projectNewWindow(project) {
  const window = Facade.projects.uiCreateWindow(project);

  const selection = { type: 'window', uid: window.uid };
  AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, selection, selection));
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

export function projectDeleteImage(project, image) {
  Facade.projects.uiDeleteImage(project, image);
}

export function projectDeleteWindow(project, window) {
  Facade.projects.uiDeleteWindow(project, window);
}

export function projectDeleteControl(project, window, control) {
  Facade.projects.uiDeleteControl(project, window, control);
}

export function projectChangeImage(project, image, data) {
  Facade.projects.uiChangeImage(project, image, data);
}

export function projectRefresh(project) {
  return {
    type: AppConstants.ActionTypes.PROJECT_REFRESH,
    project
  };
}

export function projectStateUpdateLinkData(project, linkData) {
  return {
    type: AppConstants.ActionTypes.PROJECT_STATE_UPDATE_LINK_DATA,
    project,
    linkData
  };
}

export function projectStateSelect(project, selection) {
  return {
    type: AppConstants.ActionTypes.PROJECT_STATE_SELECT,
    project,
    selection
  };
}

export function projectStateSelectAndActiveContent(project, selection, activeContent) {
  return {
    type: AppConstants.ActionTypes.PROJECT_STATE_SELECT_AND_ACTIVE_CONTENT,
    project,
    selection,
    activeContent
  };
}

'use strict';

import AppConstants from '../constants/app-constants';
import Facade from '../services/facade';

export function projectLoad(project) {
  return {
    type: AppConstants.ActionTypes.PROJECT_LOAD,
    project
  };
}

export function projectClose(project) {
  return {
    type: AppConstants.ActionTypes.PROJECT_CLOSE,
    project
  };
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

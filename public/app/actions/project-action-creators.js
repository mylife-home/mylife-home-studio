'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import Facade from '../services/facade';

export default {
  load: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_LOAD,
      project
    });
  },

  close: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_CLOSE,
      project
    });
  },

  deleteComponent: function(project, component) {
    switch(project.type) {
      case 'vpanel':
        Facade.projects.vpanelDeleteComponent(project, component);
        break;
      case 'ui':
        Facade.projects.uiDeleteComponent(project, component);
        break;
    }
  },

  deleteBinding: function(project, binding) {
    Facade.projects.vpanelDeleteBinding(project, binding);
  },

  deleteImage: function(project, image) {
    Facade.projects.uiDeleteImage(project, image);
  },

  deleteWindow: function(project, window) {
    Facade.projects.uiDeleteWindow(project, window);
  },

  deleteControl: function(project, window, control) {
    Facade.projects.uiDeleteControl(project, window, control);
  },

  changeImage: function(project, image, data) {
    Facade.projects.uiChangeImage(project, image, data);
  },

  refresh: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_REFRESH,
      project
    });
  },

  stateUpdateLinkData: function(project, linkData) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_STATE_UPDATE_LINK_DATA,
      project,
      linkData
    });
  },

  stateSelect: function(project, selection) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_STATE_SELECT,
      project,
      selection
    });
  },

  stateSelectAndActiveContent: function(project, selection, activeContent) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_STATE_SELECT_AND_ACTIVE_CONTENT,
      project,
      selection,
      activeContent
    });
  }
};
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
    Facade.projects.vpanelDeleteComponent(project, component);
  },

  deleteBinding: function(project, binding) {
    Facade.projects.vpanelDeleteBinding(project, binding);
  },

  refresh: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_REFRESH,
      project
    });
  },

  stateRefresh: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_STATE_REFRESH,
      project
    });
  }
};
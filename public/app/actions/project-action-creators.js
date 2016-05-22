'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';

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

  refresh: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_REFRESH,
      project
    });
  },

  vPanelImportToolbox: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_VPANEL_IMPORT_TOOLBOX,
      project
    });
  },

  vPanelImportDrivers: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_VPANEL_IMPORT_DRIVERS,
      project
    });
  },

  vPanelDeployVPanel: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_VPANEL_DEPLOY_VPANEL,
      project
    });
  },

  vPanelDeployDrivers: function(project) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_VPANEL_DEPLOY_DRIVERS,
      project
    });
  },
};
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
  }
};
'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';

export default {

  new: function(type) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_NEW,
      projectType: type
    });
  },

  open: function(type, content) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.PROJECT_OPEN,
      projectType: type,
      projectContent: content
    });
  }
};
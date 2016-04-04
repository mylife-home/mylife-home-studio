'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';

export default {

  clear: function() {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.REPOSITORY_CLEAR
    });
  },

  add: function(entity) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.REPOSITORY_ADD,
      entity
    });
  },

  remove: function(id) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.REPOSITORY_REMOVE,
      id
    });
  }

};
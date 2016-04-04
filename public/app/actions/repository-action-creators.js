'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';

export default {

  clear: function() {
    console.log('clear');
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.REPOSITORY_CLEAR
    });
  },

  add: function(entity) {
    console.log('add', entity);
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.REPOSITORY_ADD,
      entity
    });
  },

  remove: function(id) {
    console.log('remove', id);
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.REPOSITORY_REMOVE,
      id
    });
  }

};
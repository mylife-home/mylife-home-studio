'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';

export default {
  activate: function(id) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.TAB_ACTIVATE,
      id
    });
  }
};
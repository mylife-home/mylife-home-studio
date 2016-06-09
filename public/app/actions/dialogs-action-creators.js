'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';

export default {

  error: function(err) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.DIALOG_ERROR,
      error: err
    });
  },

  errorClean: function() {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.DIALOG_ERROR_CLEAN,
    });
  },

  setBusy: function(text) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.DIALOG_SET_BUSY,
      text
    });
  },

  unsetBusy: function() {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.DIALOG_UNSET_BUSY,
    });
  }

};
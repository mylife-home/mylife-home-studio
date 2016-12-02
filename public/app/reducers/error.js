'use strict';

import AppConstants from '../constants/app-constants';

export default function(state = null, action) {
  switch(action.type) {
    case AppConstants.ActionTypes.DIALOG_ERROR:
      return action.error;

    case AppConstants.ActionTypes.DIALOG_ERROR_CLEAN:
      return null;

    default:
      return state;
  }
};

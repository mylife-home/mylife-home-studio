'use strict';

import AppConstants from '../constants/app-constants';

export default function(state = { busyText: null, error: null }, action) {
  switch(action.type) {
    case AppConstants.ActionTypes.DIALOG_SET_BUSY:
      return { ...state, busyText: action.text };

    case AppConstants.ActionTypes.DIALOG_UNSET_BUSY:
      return { ...state, busyText: null };

    case AppConstants.ActionTypes.DIALOG_ERROR:
      return { ...state, error: action.error };

    case AppConstants.ActionTypes.DIALOG_ERROR_CLEAN:
      return { ...state, error: null };

    default:
      return state;
  }
}

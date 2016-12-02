'use strict';

import AppConstants from '../constants/app-constants';

export default function(state = null, action) {
  switch(action.type) {
    case AppConstants.ActionTypes.DIALOG_SET_BUSY:
      return action.text;

    case AppConstants.ActionTypes.DIALOG_UNSET_BUSY:
      return null;

    default:
      return state;
  }
};

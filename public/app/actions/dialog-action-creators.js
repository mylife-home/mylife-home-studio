'use strict';

import AppConstants from '../constants/app-constants';

export function dialogError(err) {
  console.log(err);
  return {
    type: AppConstants.ActionTypes.DIALOG_ERROR,
    error: err
  };
}

export function dialogErrorClean() {
  return {
    type: AppConstants.ActionTypes.DIALOG_ERROR_CLEAN,
  };
}

export function dialogSetBusy(text) {
  return {
    type: AppConstants.ActionTypes.DIALOG_SET_BUSY,
    text
  };
}

export function dialogUnsetBusy() {
  return {
    type: AppConstants.ActionTypes.DIALOG_UNSET_BUSY,
  };
}

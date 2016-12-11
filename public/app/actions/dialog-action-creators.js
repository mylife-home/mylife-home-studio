'use strict';

import AppConstants from '../constants/app-constants';
import Facade from '../services/facade';

export function dialogError(err) {
  console.log(err); // eslint-disable-line no-console
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

export function dialogInfo(info) {
  return {
    type: AppConstants.ActionTypes.DIALOG_INFO,
    info
  };
}

export function dialogInfoClean() {
  return {
    type: AppConstants.ActionTypes.DIALOG_INFO_CLEAN,
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

export function dialogOpenOperations(operations) {
  return {
    type: AppConstants.ActionTypes.DIALOG_OPEN_OPERATIONS,
    operations
  };
}

export function dialogClearOperations() {
  return {
    type: AppConstants.ActionTypes.DIALOG_CLEAR_OPERATIONS,
  };
}

export function dialogExecuteOperations() {
  return (dispatch, getState) => {
    const operations = getState().dialogs.operations;
    dispatch(dialogClearOperations());

    dispatch(dialogSetBusy('Executing deploy'));
    Facade.projects.executeDeploy({ operations }, (err) => {
      dispatch(dialogSetBusy());
      if(err) { return dispatch(dialogError(err)); }

      dispatch(dialogInfo({ title: 'Success', lines: ['Deploy done'] }));
    });
  };
}

export function dialogCancelOperations() {
  return dialogClearOperations();
}

export function dialogSetOneOperation(operation, value) {
  return {
    type: AppConstants.ActionTypes.DIALOG_SET_ONE_OPERATION,
    operation: operation.id,
    enabled: value
  };
}

export function dialogSetAllOperations(value) {
  return {
    type: AppConstants.ActionTypes.DIALOG_SET_ALL_OPERATIONS,
    enabled: value
  };
}

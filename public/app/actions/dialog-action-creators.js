'use strict';

import { actionTypes } from '../constants/index';
import Facade from '../services/facade';

export function dialogError(err) {
  console.log(err); // eslint-disable-line no-console
  return {
    type: actionTypes.DIALOG_ERROR,
    error: err
  };
}

export function dialogErrorClean() {
  return {
    type: actionTypes.DIALOG_ERROR_CLEAN,
  };
}

export function dialogInfo(info) {
  return {
    type: actionTypes.DIALOG_INFO,
    info
  };
}

export function dialogInfoClean() {
  return {
    type: actionTypes.DIALOG_INFO_CLEAN,
  };
}

export function dialogSetBusy(text) {
  return {
    type: actionTypes.DIALOG_SET_BUSY,
    text
  };
}

export function dialogUnsetBusy() {
  return {
    type: actionTypes.DIALOG_UNSET_BUSY,
  };
}

export function dialogOpenOperations(operations) {
  return {
    type: actionTypes.DIALOG_OPEN_OPERATIONS,
    operations
  };
}

export function dialogClearOperations() {
  return {
    type: actionTypes.DIALOG_CLEAR_OPERATIONS,
  };
}

export function dialogExecuteOperations() {
  return (dispatch, getState) => {

    // action: { type: 'resourceSet', resourceId, resourceContent }
    //  AppDispatcher.dispatch(resourcesSet(resourceId, resourceContent, done));

    const operations = getState().dialogs.operations.toArray();
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
    type: actionTypes.DIALOG_SET_ONE_OPERATION,
    operation: operation.uid,
    enabled: value
  };
}

export function dialogSetAllOperations(value) {
  return {
    type: actionTypes.DIALOG_SET_ALL_OPERATIONS,
    enabled: value
  };
}

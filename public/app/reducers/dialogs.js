'use strict';

import Immutable from 'immutable';
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

    case AppConstants.ActionTypes.DIALOG_INFO:
      return { ...state, info: action.info };

    case AppConstants.ActionTypes.DIALOG_INFO_CLEAN:
      return { ...state, info: null };

    case AppConstants.ActionTypes.DIALOG_OPEN_OPERATIONS:
      return { ...state, operations: Immutable.Map(action.operations.map(op => [op.id, op])) };

    case AppConstants.ActionTypes.DIALOG_CLEAR_OPERATIONS:
      return { ...state, operations: null };

    case AppConstants.ActionTypes.DIALOG_SET_ONE_OPERATION:
      return {
        ...state,
        operations: state.operations.update(action.operation, operation => ({
          ...operation,
          enabled: action.enabled
        }))
      };

    case AppConstants.ActionTypes.DIALOG_SET_ALL_OPERATIONS:
      return {
        ...state,
        operations: state.operations.map(operation => ({
          ...operation,
          enabled: action.enabled
        }))
      };

    default:
      return state;
  }
}

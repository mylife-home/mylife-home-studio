'use strict';

import Immutable from 'immutable';
import { actionTypes } from '../constants/index';

export default function(state = { busyText: null, error: null }, action) {
  switch(action.type) {
    case actionTypes.DIALOG_SET_BUSY:
      return { ...state, busyText: action.text };

    case actionTypes.DIALOG_UNSET_BUSY:
      return { ...state, busyText: null };

    case actionTypes.DIALOG_ERROR:
      return { ...state, error: action.error };

    case actionTypes.DIALOG_ERROR_CLEAN:
      return { ...state, error: null };

    case actionTypes.DIALOG_INFO:
      return { ...state, info: action.info };

    case actionTypes.DIALOG_INFO_CLEAN:
      return { ...state, info: null };

    case actionTypes.DIALOG_OPEN_OPERATIONS:
      return { ...state, operations: Immutable.Map(action.operations.map(op => [op.id, op])) };

    case actionTypes.DIALOG_CLEAR_OPERATIONS:
      return { ...state, operations: null };

    case actionTypes.DIALOG_SET_ONE_OPERATION:
      return {
        ...state,
        operations: state.operations.update(action.operation, operation => ({
          ...operation,
          enabled: action.enabled
        }))
      };

    case actionTypes.DIALOG_SET_ALL_OPERATIONS:
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

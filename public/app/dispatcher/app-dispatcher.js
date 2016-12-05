'use strict';

import { Dispatcher } from 'flux';
import AppConstants from '../constants/app-constants';

const fluxDispatcher = new Dispatcher();
let store;

export default {
  dispatch: (action) => {
    switch(action.type) {
      case AppConstants.ActionTypes.DIALOG_ERROR:
      case AppConstants.ActionTypes.DIALOG_ERROR_CLEAN:
      case AppConstants.ActionTypes.DIALOG_SET_BUSY:
      case AppConstants.ActionTypes.DIALOG_UNSET_BUSY:
        return store.dispatch(action);

      default:
        return fluxDispatcher.dispatch(action);
    }
  },

  register: (handler) => {
    return fluxDispatcher.register(handler);
  },

  setStore: (pstore) => {
    store = pstore;
  }
};


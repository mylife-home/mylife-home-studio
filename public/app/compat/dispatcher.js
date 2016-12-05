'use strict';

import { Dispatcher } from 'flux';
import AppConstants from '../constants/app-constants';
import store from './store';

const fluxDispatcher = new Dispatcher();

export default {
  dispatch: (action) => {
    switch(action.type) {
      case AppConstants.ActionTypes.DIALOG_ERROR:
      case AppConstants.ActionTypes.DIALOG_ERROR_CLEAN:
      case AppConstants.ActionTypes.DIALOG_SET_BUSY:
      case AppConstants.ActionTypes.DIALOG_UNSET_BUSY:
        return store.getStore().dispatch(action);

      default:
        return fluxDispatcher.dispatch(action);
    }
  },

  register: (handler) => {
    return fluxDispatcher.register(handler);
  },
};


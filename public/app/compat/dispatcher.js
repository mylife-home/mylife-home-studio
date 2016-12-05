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
      case AppConstants.ActionTypes.REPOSITORY_CLEAR:
      case AppConstants.ActionTypes.REPOSITORY_ADD:
      case AppConstants.ActionTypes.REPOSITORY_REMOVE:
      case AppConstants.ActionTypes.ENTITY_RESOURCES_LIST:
      case AppConstants.ActionTypes.ENTITY_PLUGINS_LIST:
      case AppConstants.ActionTypes.ENTITY_COMPONENTS_LIST:
      case AppConstants.ActionTypes.RESOURCE_GET_RESULT:
      case AppConstants.ActionTypes.RESOURCE_SET_QUERY:
      case AppConstants.ActionTypes.TAB_ACTIVATE:
        return store.getStore().dispatch(action);

        // used by both
      case AppConstants.ActionTypes.PROJECT_LOAD:
      case AppConstants.ActionTypes.PROJECT_CLOSE:
        fluxDispatcher.dispatch(action);
        return store.getStore().dispatch(action);

      default:
        return fluxDispatcher.dispatch(action);
    }
  },

  register: (handler) => {
    return fluxDispatcher.register(handler);
  },
};


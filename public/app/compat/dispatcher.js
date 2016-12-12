'use strict';

import { Dispatcher } from 'flux';
import { actionTypes } from '../constants/index';
import store from './store';

const fluxDispatcher = new Dispatcher();

export default {
  dispatch: (action) => {
    if(!action) { return; }

    if(!action.type) {
      return store.getStore().dispatch(action);
    }

    switch(action.type) {
      case actionTypes.DIALOG_ERROR:
      case actionTypes.DIALOG_ERROR_CLEAN:
      case actionTypes.DIALOG_INFO:
      case actionTypes.DIALOG_INFO_CLEAN:
      case actionTypes.DIALOG_SET_BUSY:
      case actionTypes.DIALOG_UNSET_BUSY:
      case actionTypes.DIALOG_OPEN_OPERATIONS:
      case actionTypes.DIALOG_CLEAR_OPERATIONS:
      case actionTypes.DIALOG_SET_ONE_OPERATION:
      case actionTypes.DIALOG_SET_ALL_OPERATIONS:
      case actionTypes.REPOSITORY_CLEAR:
      case actionTypes.REPOSITORY_ADD:
      case actionTypes.REPOSITORY_REMOVE:
      case actionTypes.ENTITY_RESOURCES_LIST:
      case actionTypes.ENTITY_PLUGINS_LIST:
      case actionTypes.ENTITY_COMPONENTS_LIST:
      case actionTypes.RESOURCE_GET:
      case actionTypes.RESOURCE_SET:
      case actionTypes.TAB_ACTIVATE:
        return store.getStore().dispatch(action);

        // used by both
      case actionTypes.PROJECT_LOAD:
      case actionTypes.PROJECT_CLOSE:
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


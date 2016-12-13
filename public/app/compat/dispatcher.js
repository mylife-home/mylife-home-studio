'use strict';

import { Dispatcher } from 'flux';
import store from './store';

const fluxDispatcher = new Dispatcher();

export default {
  dispatch: (action) => {
    if(!action) { return; }
    return store.getStore().dispatch(action);
  },

  register: (handler) => {
    return fluxDispatcher.register(handler);
  },
};


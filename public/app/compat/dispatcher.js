'use strict';

import store from './store';

export default {
  dispatch: (action) => {
    if(!action) { return; }
    return store.getStore().dispatch(action);
  }
};


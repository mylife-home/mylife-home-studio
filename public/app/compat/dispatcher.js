'use strict';

import store from './store';

export default {
  dispatch: (action) => {
    return store.getStore().dispatch(action);
  }
};


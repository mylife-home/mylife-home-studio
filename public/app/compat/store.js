'use strict';

let store;

export default {
  getStore: () => store,

  setStore: (pstore) => {
    store = pstore;
  }
};

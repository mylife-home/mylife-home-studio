'use strict';

import storeHandler from '../compat/store';

const state = () => storeHandler.getStore().getState();

const getResourceEntity = () => {
  const store = state();
  return store.online.entities.get(store.online.resourcesEntityId);
};

export default {

  get:(id) => state().online.entities.get(id),

  getAll: () => Array.from(state().online.entities.toArray()),

  getResourceEntity,

  getResourceNames: (startsWith) => {
    const resourcesEntity = getResourceEntity();
    if(!resourcesEntity) { return []; }
    const names = resourcesEntity.resources;
    if(!startsWith) { return names; }
    return names.filter(n => n.startsWith(startsWith));
  }
};

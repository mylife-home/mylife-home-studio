'use strict';

import storeHandler from '../compat/store';

const state = () => storeHandler.getStore().getState();

const getResourceEntity = () => Array.from(state().online.toArray()).find(e => e.resources);

export default {

  get:(id) => state().online.get(id),

  getAll: () => Array.from(state().online.toArray()),

  getResourceEntity,

  getResourceNames: (startsWith) => {
    const resourcesEntity = getResourceEntity();
    if(!resourcesEntity) { return []; }
    const names = resourcesEntity.resources;
    if(!startsWith) { return names; }
    return names.filter(n => n.startsWith(startsWith));
  }
};

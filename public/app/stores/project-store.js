'use strict';

import storeHandler from '../compat/store';

const state = () => storeHandler.getStore().getState();

export default {

  getAll: () => {
    return Array.from(state().projects.projects.toArray());
  },

  get: (uid) => {
    return state().projects.projects.get(uid);
  },

  getProjectState: (project) => {
    return state().projects.states.get(project.uid);
  }
};

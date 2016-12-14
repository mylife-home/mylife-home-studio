'use strict';

import storeHandler from '../compat/store';
import { getResourceEntity, getVPanelProjectNames, getUiProjectNames } from'../selectors/online';

const state = () => storeHandler.getStore().getState();

export default {

  get:(id) => state().online.entities.get(id),

  getAll: () => Array.from(state().online.entities.toArray()),

  getResourceEntity: () => getResourceEntity(state()),

  getResourceNames: (startsWith) => {
    switch(startsWith) {
      case 'project.vpanel.': return getVPanelProjectNames(state());
      case 'project.ui.': return getUiProjectNames(state());
      default: throw new Error('unsupported');
    }
  }
};

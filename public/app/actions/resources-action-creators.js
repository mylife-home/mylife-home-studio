'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import Facade from '../services/facade';
import shared from '../shared/index';

export default {

  entityQuery: function(entity) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.ENTITY_QUERY,
      entityId: entity.id
    });

    switch(entity.type) {
    case shared.EntityType.RESOURCES:
      Facade.resources.queryResourcesList(entity.id);
      break;

    case shared.EntityType.CORE:
      Facade.resources.queryPluginsList(entity.id);
      Facade.resources.queryComponentsList(entity.id);
      break;

    case shared.EntityType.UI:
      break;
    }
  },

  entityResourcesList: function(entityId, resources) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.ENTITY_RESOURCES_LIST,
      entityId,
      resources
    });
  },

  entityPluginsList: function(entityId, plugins) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.ENTITY_PLUGINS_LIST,
      entityId,
      plugins
    });
  },

  entityComponentsList: function(entityId, components) {
    AppDispatcher.dispatch({
      type: AppConstants.ActionTypes.ENTITY_COMPONENTS_LIST,
      entityId,
      components
    });
  }

};
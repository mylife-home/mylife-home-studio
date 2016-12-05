'use strict';

import AppDispatcher from '../compat/dispatcher';
import AppConstants from '../constants/app-constants';
import Facade from '../services/facade';
import shared from '../shared/index';

export function resourcesEntityQuery(entity) {
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
}

export function resourcesEntityResourcesList(entityId, resources) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.ENTITY_RESOURCES_LIST,
    entityId,
    resources
  });
}

export function resourcesEntityPluginsList(entityId, plugins) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.ENTITY_PLUGINS_LIST,
    entityId,
    plugins
  });
}

export function resourcesEntityComponentsList(entityId, components) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.ENTITY_COMPONENTS_LIST,
    entityId,
    components
  });
}

export function resourcesGetQuery(entityId, resourceId, cb) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.RESOURCE_GET_QUERY,
    entityId,
    resourceId
  });

  Facade.resources.queryResourceGet(entityId, resourceId, cb);
}

export function resourcesGetResult(entityId, resourceId, resourceContent) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.RESOURCE_GET_RESULT,
    entityId,
    resourceId,
    resourceContent
  });
}

export function resourcesSetQuery(entityId, resourceId, resourceContent, cb) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.RESOURCE_SET_QUERY,
    entityId,
    resourceId,
    resourceContent
  });

  Facade.resources.queryResourceSet(entityId, resourceId, resourceContent, cb);
}

export function resourcesSetResult(entityId, resourceId) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.RESOURCE_SET_RESULT,
    entityId,
    resourceId
  });
}

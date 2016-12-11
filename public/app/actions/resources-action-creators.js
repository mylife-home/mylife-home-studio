'use strict';

import async from 'async';
import AppDispatcher from '../compat/dispatcher';
import AppConstants from '../constants/app-constants';
import Facade from '../services/facade';
import shared from '../shared/index';

export function resourcesEntityQuery(entity, done) {
  return (dispatch) => {
    switch(entity.type) {
      case shared.EntityType.RESOURCES:
        Facade.resources.queryResourcesList(entity.id, (err, res) => {
          if(err) {
            if(!done) { return console.log(err); }
            return done(err);
          }

          dispatch(resourcesEntityResourcesList(entity.id, res));
          if(done) { return done(null, res); }
        });
        break;

      case shared.EntityType.CORE:
        async.parallel({
          plugins: (cb) => Facade.resources.queryPluginsList(entity.id, cb),
          components:  (cb) => Facade.resources.queryComponentsList(entity.id, cb)
        }, (err, res) => {
          if(err) {
            if(!done) { return console.log(err); }
            return done(err);
          }

          dispatch(resourcesEntityPluginsList(entity.id, res.plugins));
          dispatch(resourcesEntityComponentsList(entity.id, res.components));
          if(done) { return done(null, res); }
        });
        break;

      case shared.EntityType.UI:
        // TODO
        break;
    }
  };
}

export function resourcesEntityResourcesList(entityId, resources) {
  return {
    type: AppConstants.ActionTypes.ENTITY_RESOURCES_LIST,
    entityId,
    resources
  };
}

export function resourcesEntityPluginsList(entityId, plugins) {
  return {
    type: AppConstants.ActionTypes.ENTITY_PLUGINS_LIST,
    entityId,
    plugins
  };
}

export function resourcesEntityComponentsList(entityId, components) {
  return {
    type: AppConstants.ActionTypes.ENTITY_COMPONENTS_LIST,
    entityId,
    components
  };
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

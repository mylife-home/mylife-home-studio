'use strict';

import async from 'async';
import { actionTypes } from '../constants/index';
import Facade from '../services/facade';
import shared from '../shared/index';

export function resourcesEntityQuery(entity, done) {
  return (dispatch) => {
    switch(entity.type) {
      case shared.EntityType.RESOURCES:
        Facade.resources.queryResourcesList(entity.id, (err, res) => {
          if(err) {
            if(!done) { return console.log(err); } // eslint-disable-line no-console
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
            if(!done) { return console.log(err); } // eslint-disable-line no-console
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
    type: actionTypes.ENTITY_RESOURCES_LIST,
    entityId,
    resources
  };
}

export function resourcesEntityPluginsList(entityId, plugins) {
  return {
    type: actionTypes.ENTITY_PLUGINS_LIST,
    entityId,
    plugins
  };
}

export function resourcesEntityComponentsList(entityId, components) {
  return {
    type: actionTypes.ENTITY_COMPONENTS_LIST,
    entityId,
    components
  };
}

export function resourcesGet(entityId, resourceId, done) {
  return (dispatch) => {
    Facade.resources.queryResourceGet(entityId, resourceId, (err, res) => {
      if(err) {
        if(!done) { return console.log(err); } // eslint-disable-line no-console
        return done(err);
      }

      dispatch(resourcesGetResult(entityId, resourceId, res));
      if(done) { return done(null, res); }
    });
  };
}

export function resourcesGetResult(entityId, resourceId, resourceContent) {
  return {
    type: actionTypes.RESOURCE_GET,
    entityId,
    resourceId,
    resourceContent
  };
}

export function resourcesSetQuery(entityId, resourceId, resourceContent, done) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.RESOURCE_SET,
      entityId,
      resourceId,
      resourceContent
    });

    Facade.resources.queryResourceSet(entityId, resourceId, resourceContent, (err, res) => {
      if(err) {
        if(!done) { return console.log(err); } // eslint-disable-line no-console
        return done(err);
      }

      if(done) { return done(null, res); }
    });
  };
}

'use strict';

import async from 'async';
import { actionTypes } from '../constants/index';
import Facade from '../services/facade';
import shared from '../shared/index';
import { getResourceEntity, getEntities } from'../selectors/online';

function isKnownEntityType(entity) {
  switch(entity.type) {
    case shared.EntityType.RESOURCES:
    case shared.EntityType.CORE:
    case shared.EntityType.UI:
      return true;
  }

  return false;
}

export function resourcesNetworkSystemQuery(done) {
  return (dispatch, getState) => {
    const entities = getEntities(getState()).toArray();

    async.parallel(entities.map(e => cb => dispatch(resourcesEntitySystemQuery(e, cb)), err => {
      if(err && !done) { return console.log(err); } // eslint-disable-line no-console
      return done(err);
    }));
  };
}

export function resourcesEntitySystemQuery(entity, done) {
  return (dispatch) => {

    if(!isKnownEntityType(entity)) {
      return done && done();
    }

    Facade.resources.querySysInfo(entity.id, (err, res) => {
      if(err) {
        if(!done) { return console.log(err); } // eslint-disable-line no-console
        return done(err);
      }

      dispatch(resourcesEntitiesSystemInfo(entity.id, res));
      if(done) { return done(); }
    });
  };
}

export function resourcesEntitiesSystemInfo(entityId, system) {
  return {
    type: actionTypes.ENTITY_RESOURCES_SYSTEM,
    entityId,
    system
  };
}

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
        Facade.resources.queryUiSessionList(entity.id, (err, res) => {
          if(err) {
            if(!done) { return console.log(err); } // eslint-disable-line no-console
            return done(err);
          }

          dispatch(resourcesEntityUiSessionList(entity.id, res));
          if(done) { return done(null, res); }
        });
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

export function resourcesEntityUiSessionList(entityId, sessions) {
  return {
    type: actionTypes.ENTITY_UI_SESSION_LIST,
    entityId,
    sessions
  };
}

export function resourcesGet(entityId, resourceId, done) {
  return (dispatch) => {
    Facade.resources.queryResourceGet(entityId, resourceId, (err, resourceContent) => {
      if(err) {
        if(!done) { return console.log(err); } // eslint-disable-line no-console
        return done(err);
      }

      dispatch({
        type: actionTypes.RESOURCE_GET,
        entityId,
        resourceId,
        resourceContent
      });

      if(done) { return done(null, resourceContent); }
    });
  };
}

export function resourcesSet(resourceId, resourceContent, done) {
  return (dispatch, getState) => {
    let entityId;
    try {
      const entity = getResourceEntity(getState());
      if(!entity) { throw new Error('No resource entity on network'); }
      entityId = entity.id;
    } catch(err) {
      if(!done) { return console.log(err); } // eslint-disable-line no-console
      return done(err);
    }

    Facade.resources.queryResourceSet(entityId, resourceId, resourceContent, (err, resourceContent) => {
      if(err) {
        if(!done) { return console.log(err); } // eslint-disable-line no-console
        return done(err);
      }

      dispatch({
        type: actionTypes.RESOURCE_SET,
        entityId,
        resourceId,
        resourceContent
      });

      if(done) { return done(null, resourceContent); }
    });
  };
}

export function resourcesUiSessionKill(entityId, sessionId, done) {
  return (dispatch, getState) => {
    const entity = getEntities(getState()).get(entityId);

    Facade.resources.queryUiSessionKill(entityId, sessionId, (err) => {
      if(err) {
        if(!done) { return console.log(err); } // eslint-disable-line no-console
        return done(err);
      }

      dispatch(resourcesEntityQuery(entity, done));

      if(done) { return done(); }
    });
  };}

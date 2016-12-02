'use strict';

import AppConstants from '../constants/app-constants';
import Immutable from 'immutable';

export default function(state = Immutable.Map(), action) {

  switch(action.type) {
    case AppConstants.ActionTypes.REPOSITORY_CLEAR:
      return state.clear();

    case AppConstants.ActionTypes.REPOSITORY_ADD:
      return state.set(action.entity.id, action.entity); // TODO: ensure no changes

    case AppConstants.ActionTypes.REPOSITORY_REMOVE:
      return state.delete(action.id);

    case AppConstants.ActionTypes.ENTITY_RESOURCES_LIST:
      return state.update(action.entityId, entity => ({
        ...entity,
        resources: action.resources, // TODO: ensure no changes
        cachedResources: null
      }));

    case AppConstants.ActionTypes.ENTITY_PLUGINS_LIST:
      return state.update(action.entityId, entity => ({
        ...entity,
        plugins: action.plugins // TODO: ensure no changes
      }));

    case AppConstants.ActionTypes.ENTITY_COMPONENTS_LIST:
      return state.update(action.entityId, entity => ({
        ...entity,
        components: action.components // TODO: ensure no changes
      }));

    case AppConstants.ActionTypes.RESOURCE_GET_RESULT:
    case AppConstants.ActionTypes.RESOURCE_SET_QUERY:
      return state.update(action.entityId, entity => ({
        ...entity,
        cachedResources: {
          ...entity.cachedResources,
          [action.resourceId]: action.resourceContent
        }
      }));

    default:
      return state;
  }
};

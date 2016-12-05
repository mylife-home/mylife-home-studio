'use strict';

import AppConstants from '../constants/app-constants';
import Immutable from 'immutable';
import shared from '../shared/index';

export default function(state = { entities: Immutable.Map(), resourceEntityId: null }, action) {

  switch(action.type) {
    case AppConstants.ActionTypes.REPOSITORY_CLEAR:
      return { entities: state.entities.clear(), ...state };

    case AppConstants.ActionTypes.REPOSITORY_ADD:
      return {
        ...state,
        entities: state.entities.set(action.entity.id, action.entity),
        resourceEntityId: (action.entity.type === shared.EntityType.RESOURCES) ? action.entity.id : state.resourceEntityId
      };

    case AppConstants.ActionTypes.REPOSITORY_REMOVE:
      return {
        ...state,
        entities: state.entities.delete(action.id),
        resourceEntityId: (state.resourceEntityId === action.id) ? null : state.resourceEntityId
      };

    case AppConstants.ActionTypes.ENTITY_RESOURCES_LIST:
      return { ...state, entities: state.entities.update(action.entityId, entity => ({
        ...entity,
        resources: action.resources,
        cachedResources: null
      }))};

    case AppConstants.ActionTypes.ENTITY_PLUGINS_LIST:
      return { ...state, entities: state.entities.update(action.entityId, entity => ({
        ...entity,
        plugins: action.plugins
      }))};

    case AppConstants.ActionTypes.ENTITY_COMPONENTS_LIST:
      return { ...state, entities: state.entities.update(action.entityId, entity => ({
        ...entity,
        components: action.components
      }))};

    case AppConstants.ActionTypes.RESOURCE_GET_RESULT:
    case AppConstants.ActionTypes.RESOURCE_SET_QUERY:
      return { ...state, entities: state.entities.update(action.entityId, entity => ({
        ...entity,
        cachedResources: {
          ...entity.cachedResources,
          [action.resourceId]: action.resourceContent
        }
      }))};

    default:
      return state;
  }
}

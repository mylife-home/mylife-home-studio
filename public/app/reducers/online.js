'use strict';

import { actionTypes } from '../constants/index';
import Immutable from 'immutable';
import shared from '../shared/index';

export default function(state = { entities: Immutable.Map(), resourcesEntityId: null }, action) {

  switch(action.type) {
    case actionTypes.REPOSITORY_CLEAR:
      return { ...state, entities: state.entities.clear() };

    case actionTypes.REPOSITORY_ADD:
      return {
        ...state,
        entities: state.entities.set(action.entity.id, action.entity),
        resourcesEntityId: (action.entity.type === shared.EntityType.RESOURCES) ? action.entity.id : state.resourcesEntityId
      };

    case actionTypes.REPOSITORY_REMOVE:
      return {
        ...state,
        entities: state.entities.delete(action.id),
        resourcesEntityId: (state.resourcesEntityId === action.id) ? null : state.resourcesEntityId
      };

    case actionTypes.ENTITY_RESOURCES_SYSTEM:
      return { ...state, entities: state.entities.update(action.entityId, entity => ({
        ...entity,
        system: action.system
      }))};

    case actionTypes.ENTITY_RESOURCES_LIST:
      return { ...state, entities: state.entities.update(action.entityId, entity => ({
        ...entity,
        resources: action.resources,
        cachedResources: null
      }))};

    case actionTypes.ENTITY_PLUGINS_LIST:
      return { ...state, entities: state.entities.update(action.entityId, entity => ({
        ...entity,
        plugins: action.plugins
      }))};

    case actionTypes.ENTITY_COMPONENTS_LIST:
      return { ...state, entities: state.entities.update(action.entityId, entity => ({
        ...entity,
        components: action.components
      }))};

    case actionTypes.ENTITY_UI_SESSION_LIST:
      return { ...state, entities: state.entities.update(action.entityId, entity => ({
        ...entity,
        sessions: action.sessions
      }))};

    case actionTypes.RESOURCE_GET:
    case actionTypes.RESOURCE_SET:
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

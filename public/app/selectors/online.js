'use strict';

import { createSelector } from 'reselect';
import shared from '../shared/index';

export const getEntities          = (state) => state.online.entities;
export const getResourcesEntityId = (state) => state.online.resourcesEntityId;

export const getResourceEntity = createSelector(
  [ getEntities, getResourcesEntityId ],
  (entities, resourcesEntityId) => entities.get(resourcesEntityId)
);

export const getCoreEntities = createSelector(
  [ getEntities ],
  (entities) => Array.from(entities.filter(e => e.type === shared.EntityType.CORE).values())
);

function resourcesStartWith(resourcesEntity, startsWith) {
  if(!resourcesEntity || !resourcesEntity.resources) { return []; }
  const names = resourcesEntity.resources;
  return names.filter(n => n.startsWith(startsWith)).map(name => name.substring(startsWith.length));
}

export const getVPanelProjectNames = createSelector(
  [ getResourceEntity ],
  (resourcesEntity) => resourcesStartWith(resourcesEntity, 'project.vpanel.')
);

export const getUiProjectNames = createSelector(
  [ getResourceEntity ],
  (resourcesEntity) => resourcesStartWith(resourcesEntity, 'project.ui.')
);

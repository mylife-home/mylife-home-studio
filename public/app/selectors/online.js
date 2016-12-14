'use strict';

import { createSelector } from 'reselect';

function getEntities(state) {
  return state.online.entities;
}

function getResourcesEntityId(state) {
  return state.online.resourcesEntityId;
}

export const getResourceEntity = createSelector(
  [ getEntities, getResourcesEntityId ],
  (entities, resourcesEntityId) => entities.get(resourcesEntityId)
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

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

export const getEntityOutdatedPlugins = (state, { entity }) => {
  const pluginRepository = state.online.pluginRepository && state.online.pluginRepository.list;
  if(!pluginRepository) { return null; }
  if(!entity.plugins) { return null; }

  const pluginMap = new Map();
  for(const plugin of entity.plugins) {
    if(pluginMap.get(plugin.library)) { continue; }
    const versionData = plugin.version.split(' ');
    pluginMap.set(plugin.library, { name: plugin.library, localDate: versionData[0], localCommit: versionData[1] });
  }

  const plugins = Array.from(pluginMap.values());
  for(const plugin of plugins) {
    const repoPlugin = pluginRepository.find(p => plugin.name === p.name);
    if(!repoPlugin) {
      console.warn(`failed to fetch plugin ${plugin.name}`); // eslint-disable-line no-console
      continue;
    }

    plugin.repoCommit = repoPlugin.commit.substr(0, 7);
    plugin.repoDate   = repoPlugin.date;
  }

  return plugins.filter(p => !p.repoCommit || p.repoCommit === p.localCommit);
};
'use strict';

import { createSelector } from 'reselect';
import { getProject } from './projects';

export const getComponents = (state, props) => getProject(state, props).components;
export const getPlugins    = (state, props) => getProject(state, props).plugins;
export const getBindings   = (state, props) => getProject(state, props).bindings;

export const getComponent  = (state, props) => getComponents(state, props).get(props.component);
export const getPlugin     = (state, props) => getPlugins(state, props).get(props.plugin);
export const getBinding    = (state, props) => getBindings(state, props).get(props.binding);


export const makeGetToolbox = () => createSelector(
  [ getPlugins ],
  (plugins) => plugins.
    groupBy(it => it.entityId).
    map((map, entityId) => ({ entityId, plugins: map.toArray() })).
    toArray()
);
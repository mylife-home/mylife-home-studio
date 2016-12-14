'use strict';

import { createSelector } from 'reselect';

function getComponents(state, { project }) {
  return state.projects.projects.get(project).components;
}

function getImages(state, { project }) {
  return state.projects.projects.get(project).images;
}

function getWindows(state, { project }) {
  return state.projects.projects.get(project).windows;
}

export const makeGetSortedComponents = () => createSelector(
  [ getComponents ],
  (components) => components.sortBy(it => it.id).toArray()
);

export const makeGetSortedImages = () => createSelector(
  [ getImages ],
  (images) => images.sortBy(it => it.id).toArray()
);

export const makeGetSortedWindows = () => createSelector(
  [ getWindows ],
  (windows) => windows.sortBy(it => it.id).toArray()
);

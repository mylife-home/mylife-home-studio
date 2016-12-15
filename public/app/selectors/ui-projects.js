'use strict';

import { createSelector } from 'reselect';
import { getProject } from './projects';

export const getComponents = (state, props) => getProject(state, props).components;
export const getImages     = (state, props) => getProject(state, props).images;
export const getWindows    = (state, props) => getProject(state, props).windows;

export const getComponent  = (state, props) => getProject(state, props).components.get(props.component);
export const getImage      = (state, props) => getProject(state, props).images.get(props.image);
export const getWindow     = (state, props) => getProject(state, props).windows.get(props.window);

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

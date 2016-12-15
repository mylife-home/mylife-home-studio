'use strict';

//import { createSelector } from 'reselect';

export const getProjects = (state) => state.projects.projects;
export const getProject  = (state, { project }) => state.projects.projects.get(project);

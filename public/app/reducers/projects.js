'use strict';

import AppConstants from '../constants/app-constants';
import Immutable from 'immutable';

export default function(state = { projects: Immutable.Map(), states: Immutable.Map() }, action) {

  switch(action.type) {
    case AppConstants.ActionTypes.PROJECT_LOAD:
      {
        const project = action.project;
        project.version = 1;
        return {
          ...state,
          projects: state.projects.set(project.uid, project),
          states: state.states.set(project.uid, {})
        };
      }

    case AppConstants.ActionTypes.PROJECT_CLOSE:
      return {
        ...state,
        projects: state.projects.delete(action.project.uid),
        states: state.states.delete(action.project.uid)
      };

    // FIXME
    case AppConstants.ActionTypes.PROJECT_REFRESH:
      return  { ...state, projects: state.projects.update(action.project.uid, project => ({
        ...project,
        version: project.version + 1
      })) };

    // FIXME
    case AppConstants.ActionTypes.PROJECT_STATE_REFRESH:
      return { ...state, states: state.states.update(action.project.uid, state => ({ ... state })) };

    default:
      return state;
  }
};

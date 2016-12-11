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

    case AppConstants.ActionTypes.PROJECT_CHANGE_NAME:
      return {
        ...state,
        projects: state.projects.update(action.project.uid, project => ({
          ...project,
          name       : action.newName,
          dirty      : true,
          lastUpdate : new Date(),
          version: project.version + 1 // TODO: remove me
        }))
      };

    // FIXME
    case AppConstants.ActionTypes.PROJECT_REFRESH:
      return  { ...state, projects: state.projects.update(action.project.uid, project => ({
        ...project,
        version: project.version + 1
      })) };

    case AppConstants.ActionTypes.PROJECT_STATE_UPDATE_LINK_DATA:
      return { ...state, states: state.states.update(action.project.uid, state => ({ ... state, linkData: action.linkData })) };

    case AppConstants.ActionTypes.PROJECT_STATE_SELECT:
      return { ...state, states: state.states.update(action.project.uid, state => ({ ... state, selection: action.selection })) };

    case AppConstants.ActionTypes.PROJECT_STATE_SELECT_AND_ACTIVE_CONTENT:
      return { ...state, states: state.states.update(action.project.uid, state => ({ ... state, selection: action.selection, activeContent : action.activeContent })) };

    default:
      return state;
  }
}

'use strict';

import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default function(state = { projects: Immutable.Map(), states: Immutable.Map() }, action) {

  switch(action.type) {
    case actionTypes.PROJECT_LOAD:
      {
        const project = action.project;
        project.version = 1;
        return {
          ...state,
          projects: state.projects.set(project.uid, project),
          states: state.states.set(project.uid, {})
        };
      }

    case actionTypes.PROJECT_CLOSE:
      return {
        ...state,
        projects: state.projects.delete(action.project.uid),
        states: state.states.delete(action.project.uid)
      };

    case actionTypes.PROJECT_CHANGE_NAME:
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
    case actionTypes.PROJECT_REFRESH:
      return  { ...state, projects: state.projects.update(action.project.uid, project => ({
        ...project,
        version: project.version + 1
      })) };

    case actionTypes.PROJECT_STATE_UPDATE_LINK_DATA:
      return { ...state, states: state.states.update(action.project.uid, state => ({ ... state, linkData: action.linkData })) };

    case actionTypes.PROJECT_STATE_SELECT:
      return { ...state, states: state.states.update(action.project.uid, state => ({ ... state, selection: action.selection })) };

    case actionTypes.PROJECT_STATE_SELECT_AND_ACTIVE_CONTENT:
      return { ...state, states: state.states.update(action.project.uid, state => ({ ... state, selection: action.selection, activeContent : action.activeContent })) };

    default:
      return state;
  }
}

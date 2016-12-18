'use strict';

import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

function updateProject(state, action, changedProps) {
  return {
    ...state,
    projects: state.projects.update(action.project, project => {

      if(typeof changedProps === 'function') {
        changedProps = changedProps(project);
      }

      return {
        ...project,
        ...changedProps,
        dirty      : true,
        lastUpdate : new Date(),
        version    : project.version + 1 // TODO: remove me
      };
    })
  };
}

function updateImage(state, action, changedProps) {
  return updateProject(state, action, project => ({
    images : project.images.update(action.image, image => {

      if(typeof changedProps === 'function') {
        changedProps = changedProps(image);
      }

      return {
        ...image,
        ...changedProps
      };
    })
  }));
}

function updateWindow(state, action, changedProps) {
  return updateProject(state, action, project => ({
    windows : project.windows.update(action.window, window => {

      if(typeof changedProps === 'function') {
        changedProps = changedProps(window);
      }

      return {
        ...window,
        ...changedProps
      };
    })
  }));
}

function updateControl(state, action, changedProps) {
  return updateWindow(state, action, window => ({
    controls : window.controls.update(action.control, control => {

      if(typeof changedProps === 'function') {
        changedProps = changedProps(control);
      }

      return {
        ...control,
        ...changedProps
      };
    })
  }));
}

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
      return updateProject(state, action, { name : action.newName });

    case actionTypes.PROJECT_DELETE_UI_COMPONENT: // merge with PROJECT_DELETE_COMPONENT (vpane) ?
      return updateProject(state, action, project => ({ components : project.components.delete(action.component) }));

    case actionTypes.PROJECT_CHANGE_DEFAULT_WINDOW:
      return updateProject(state, action, { defaultWindow : action.window });

    case actionTypes.PROJECT_NEW_IMAGE:
      return updateProject(state, action, project => ({ images : project.images.set(action.image.uid, action.image) }));

    case actionTypes.PROJECT_DELETE_IMAGE:
      return updateProject(state, action, project => ({ images : project.images.delete(action.image) }));

    case actionTypes.PROJECT_IMAGE_CHANGE_DATA:
      return updateImage(state, action, { content : action.data });

    case actionTypes.PROJECT_IMAGE_CHANGE_ID:
      return updateImage(state, action, { id : action.id });

    case actionTypes.PROJECT_NEW_WINDOW:
      return updateProject(state, action, project => ({ windows : project.windows.set(action.window.uid, action.window) }));

    case actionTypes.PROJECT_DELETE_WINDOW:
      return updateProject(state, action, project => ({ windows : project.windows.delete(action.window) }));

    case actionTypes.PROJECT_WINDOW_CHANGE_ID:
      return updateWindow(state, action, { id: action.id });

    case actionTypes.PROJECT_RESIZE_WINDOW:
      return updateWindow(state, action, { height: action.height, width: action.width });

    case actionTypes.PROJECT_WINDOW_CHANGE_IMAGE:
      return updateWindow(state, action, { backgroundResource: action.image });

    case actionTypes.PROJECT_NEW_CONTROL:
      return updateWindow(state, action, window => ({ controls : window.controls.set(action.control.uid, action.control) }));

    case actionTypes.PROJECT_DELETE_CONTROL:
      return updateWindow(state, action, window => ({ controls : window.controls.delete(action.control) }));

    case actionTypes.PROJECT_CONTROL_CHANGE_ACTION:
      return updateControl(state, action, { [action.actionType] : action.action });

    // FIXME
    case actionTypes.PROJECT_REFRESH:
      return  { ...state, projects: state.projects.update(action.project, project => ({
        ...project,
        version: project.version + 1
      })) };

    case actionTypes.PROJECT_STATE_UPDATE_LINK_DATA:
      return { ...state, states: state.states.update(action.project, state => ({ ... state, linkData: action.linkData })) };

    case actionTypes.PROJECT_STATE_SELECT:
      return { ...state, states: state.states.update(action.project, state => ({ ... state, selection: action.selection })) };

    case actionTypes.PROJECT_STATE_SELECT_AND_ACTIVE_CONTENT:
      return { ...state, states: state.states.update(action.project, state => ({ ... state, selection: action.selection, activeContent : action.activeContent })) };

    default:
      return state;
  }
}

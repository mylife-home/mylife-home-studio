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
        lastUpdate : new Date()
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

function updateControlTextContext(state, action, changedProps) {
  return updateControl(state, action, control => ({
    text : { ...control.text, context : control.text.context.update(action.item, item => {

      if(typeof changedProps === 'function') {
        changedProps = changedProps(item);
      }

      return {
        ...item,
        ...changedProps
      };
    })}
  }));
}

function updateControlDisplayMap(state, action, changedProps) {
  return updateControl(state, action, control => ({
    display : { ...control.display, map : control.display.map.update(action.item, item => {

      if(typeof changedProps === 'function') {
        changedProps = changedProps(item);
      }

      return {
        ...item,
        ...changedProps
      };
    })}
  }));
}

function updateComponent(state, action, changedProps) {
  return updateProject(state, action, project => ({
    components : project.components.update(action.component, component => {

      if(typeof changedProps === 'function') {
        changedProps = changedProps(component);
      }

      return {
        ...component,
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
        return {
          ...state,
          projects: state.projects.set(project.uid, project),
          states: state.states.set(project.uid, {})
        };
      }

    case actionTypes.PROJECT_CLOSE:
      return {
        ...state,
        projects: state.projects.delete(action.project),
        states: state.states.delete(action.project)
      };

    case actionTypes.PROJECT_SAVED:
      return {
        ...state,
        projects: state.projects.update(action.project, project => ({ ...project, dirty : false }))
      };

    case actionTypes.PROJECT_CHANGE_NAME:
      return updateProject(state, action, { name : action.newName });

    case actionTypes.PROJECT_NEW_COMPONENT:
      return updateProject(state, action, project => ({ components : project.components.set(action.component.uid, action.component) }));

    case actionTypes.PROJECT_DELETE_VPANEL_COMPONENT:
      return updateProject(state, action, project => ({ components : project.components.delete(action.component) }));

    case actionTypes.PROJECT_COMPONENT_CHANGE_ID:
      return updateComponent(state, action, { id: action.id });

    case actionTypes.PROJECT_MOVE_COMPONENT:
      return updateComponent(state, action, component => ({ designer: { ...component.designer, location: action.location } }));

    case actionTypes.PROJECT_COMPONENT_CHANGE_CONFIG:
      return updateComponent(state, action, component => ({ config: { ...component.config, [action.name]: action.value } }));

    case actionTypes.PROJECT_NEW_BINDING:
      return updateProject(state, action, project => ({
        bindings   : project.bindings.set(action.binding.uid, action.binding),
        components : project.components.
          update(action.binding.local,  component => ({ ...component, bindings : component.bindings.add(action.binding.uid) })).
          update(action.binding.remote, component => ({ ...component, bindings : component.bindingTargets.add(action.binding.uid) }))
      }));

    case actionTypes.PROJECT_DELETE_BINDING:
      return updateProject(state, action, project => ({
        bindings   : project.bindings.delete(action.binding),
        components : project.components.
          update(action.local,  component => ({ ...component, bindings : component.bindings.delete(action.binding) })).
          update(action.remote, component => ({ ...component, bindings : component.bindingTargets.delete(action.binding) }))
      }));

    case actionTypes.PROJECT_NEW_PLUGIN:
      return updateProject(state, action, project => ({ plugins : project.plugins.set(action.plugin.uid, action.plugin) }));

    case actionTypes.PROJECT_DELETE_PLUGIN:
      return updateProject(state, action, project => ({ plugins : project.plugins.delete(action.plugin) }));

    case actionTypes.PROJECT_COMPONENT_SET_PLUGIN:
      return updateProject(state, action, project => ({
        components : project.components.update(action.component, component => ({
          ...component,
          plugin: action.plugin
        }))
      }));

    case actionTypes.PROJECT_DELETE_UI_COMPONENT: // merge with PROJECT_DELETE_COMPONENT (vpanel) ?
      return updateProject(state, action, project => ({ components : project.components.delete(action.component) }));

    case actionTypes.PROJECT_CHANGE_DESKTOP_DEFAULT_WINDOW:
      return updateProject(state, action, { desktopDefaultWindow : action.window });

    case actionTypes.PROJECT_CHANGE_MOBILE_DEFAULT_WINDOW:
      return updateProject(state, action, { mobileDefaultWindow : action.window });

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

    case actionTypes.PROJECT_MOVE_CONTROL:
      return updateControl(state, action, action.position);

    case actionTypes.PROJECT_RESIZE_CONTROL:
      return updateControl(state, action, action.size);

    case actionTypes.PROJECT_CONTROL_CHANGE_ID:
      return updateControl(state, action, { id : action.id });

    case actionTypes.PROJECT_CONTROL_CHANGE_TEXT_FORMAT:
      return updateControl(state, action, control => ({ text : { ...control.text, format : action.format } }));

    case actionTypes.PROJECT_CONTROL_ADD_TEXT_CONTEXT:
      return updateControl(state, action, control => ({ text : { ...control.text, context: control.text.context.set(action.newItem.uid, action.newItem) } }));

    case actionTypes.PROJECT_CONTROL_DELETE_TEXT_CONTEXT:
      return updateControl(state, action, control => ({ text : { ...control.text, context: control.text.context.delete(action.item) } }));

    case actionTypes.PROJECT_CONTROL_CHANGE_TEXT_CONTEXT_ID:
      return updateControlTextContext(state, action, { id : action.id });

    case actionTypes.PROJECT_CONTROL_CHANGE_TEXT_CONTEXT_COMPONENT:
      return updateControlTextContext(state, action, { component : action.component, attribute : action.attribute });

    case actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_COMPONENT:
      return updateControl(state, action, control => ({ display : { ...control.display, component : action.component, attribute : action.attribute } }));

    case actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_MAPPING_IMAGE:
      return updateControlDisplayMap(state, action, { image : action.image });

    case actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_MAPPING_VALUE:
      return updateControlDisplayMap(state, action, { value : action.value });

    case actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_MAPPING_MIN:
      return updateControlDisplayMap(state, action, { min : action.min });

    case actionTypes.PROJECT_CONTROL_CHANGE_DISPLAY_MAPPING_MAX:
      return updateControlDisplayMap(state, action, { max : action.max });

    case actionTypes.PROJECT_CONTROL_ADD_DISPLAY_MAPPING:
      return updateControl(state, action, control => ({ display : { ...control.display, map: control.display.map.set(action.newItem.uid, action.newItem) } }));

    case actionTypes.PROJECT_CONTROL_DELETE_DISPLAY_MAPPING:
      return updateControl(state, action, control => ({ display : { ...control.display, map: control.display.map.delete(action.item) } }));

    case actionTypes.PROJECT_CONTROL_CHANGE_IMAGE:
      return updateControl(state, action, control => ({ display : { ...control.display, defaultResource : action.image } }));

    case actionTypes.PROJECT_CONTROL_CHANGE_ACTION:
      return updateControl(state, action, { [action.actionType] : action.action });

    case actionTypes.PROJECT_STATE_SELECT:
      return { ...state, states: state.states.update(action.project, state => ({ ... state, selection: action.selection })) };

    case actionTypes.PROJECT_STATE_SELECT_AND_ACTIVE_CONTENT:
      return { ...state, states: state.states.update(action.project, state => ({ ... state, selection: action.selection, activeContent : action.activeContent })) };

    case actionTypes.PROJECT_STATE_UI_PENDING_IMPORT_COMPONENTS:
      return { ...state, states: state.states.update(action.project, state => ({ ... state, pendingImportComponents: action.data })) };

    case actionTypes.PROJECT_STATE_VPANEL_PENDING_IMPORT_TOOLBOX:
      return { ...state, states: state.states.update(action.project, state => ({ ... state, pendingImportToolbox: action.data })) };

    default:
      return state;
  }
}

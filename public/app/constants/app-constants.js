'use strict';

import keyMirror from 'keymirror';

export default {
  ActionTypes: keyMirror({
    REPOSITORY_CLEAR: null,
    REPOSITORY_ADD: null,
    REPOSITORY_REMOVE: null,

    ENTITY_QUERY: null,
    ENTITY_RESOURCES_LIST: null,
    ENTITY_PLUGINS_LIST: null,
    ENTITY_COMPONENTS_LIST: null,

    RESOURCE_GET_QUERY: null,
    RESOURCE_GET_RESULT: null,
    RESOURCE_SET_QUERY: null,
    RESOURCE_SET_RESULT: null,

    DIALOG_ERROR: null,
    DIALOG_ERROR_CLEAN: null,
    DIALOG_SET_BUSY: null,
    DIALOG_UNSET_BUSY: null,

    PROJECT_LOAD: null,
    PROJECT_CLOSE: null,
    PROJECT_REFRESH: null,
    PROJECT_STATE_UPDATE_LINK_DATA: null,
    PROJECT_STATE_SELECT: null,
    PROJECT_STATE_SELECT_AND_ACTIVE_CONTENT: null,
    PROJECT_CHANGE_NAME: null,
    PROJECT_NEW_COMPONENT: null,
    PROJECT_DELETE_COMPONENT: null,
    PROJECT_COMPONENT_CHANGE_ID: null,
    PROJECT_MOVE_COMPONENT: null,
    PROJECT_COMPONENT_CHANGE_CONFIG: null,

    TAB_ACTIVATE: null,
  }),

  DragTypes: keyMirror({
    VPANEL_PLUGIN: null,
    VPANEL_COMPONENT: null,
    VPANEL_COMPONENT_ATTRIBUTE: null,

    UI_TOOLBOX_CONTROL: null,
    UI_CONTROL: null
  })
};
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

    PROJECT_LOAD: null,
    PROJECT_CLOSE: null,
    PROJECT_REFRESH: null,

    TAB_ACTIVATE: null,
  })
};
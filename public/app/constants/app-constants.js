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
    ENTITY_COMPONENTS_LIST: null
  })
};
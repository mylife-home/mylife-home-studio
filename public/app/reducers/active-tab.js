'use strict';

import { actionTypes } from '../constants/index';

const DEFAULT_TAB = 'online';

export default function(state = DEFAULT_TAB, action) {
  switch(action.type) {
    case actionTypes.PROJECT_LOAD:
      return `project-${action.project.uid}`;

    case actionTypes.PROJECT_CLOSE:
      if(`project-${action.project}` !== state) { return state; }
      return DEFAULT_TAB;

    case actionTypes.TAB_ACTIVATE:
      return action.key;

    default:
      return state;
  }
}

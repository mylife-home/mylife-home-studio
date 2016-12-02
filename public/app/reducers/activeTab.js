'use strict';

import AppConstants from '../constants/app-constants';

const DEFAULT_TAB = 'online';

export default function(state = DEFAULT_TAB, action) {
  switch(action.type) {
    case AppConstants.ActionTypes.PROJECT_LOAD:
      return action.project.uid;

    case AppConstants.ActionTypes.PROJECT_CLOSE:
      if(action.project.uid !== state) { return state; }
      return DEFAULT_TAB;

    case AppConstants.ActionTypes.TAB_ACTIVATE:
      return action.id;

    default:
      return state;
  }
};

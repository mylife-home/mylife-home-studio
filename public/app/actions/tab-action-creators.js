'use strict';

import AppConstants from '../constants/app-constants';

export function tabActivate(id) {
  return {
    type: AppConstants.ActionTypes.TAB_ACTIVATE,
    id
  };
}
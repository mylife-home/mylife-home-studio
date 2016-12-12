'use strict';

import { actionTypes } from '../constants/index';

export function tabActivate(id) {
  return {
    type: actionTypes.TAB_ACTIVATE,
    id
  };
}
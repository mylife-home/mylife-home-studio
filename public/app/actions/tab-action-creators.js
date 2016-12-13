'use strict';

import { actionTypes } from '../constants/index';

export function tabActivate(key) {
  return {
    type: actionTypes.TAB_ACTIVATE,
    key
  };
}
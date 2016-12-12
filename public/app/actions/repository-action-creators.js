'use strict';

import { actionTypes } from '../constants/index';
import { resourcesEntityQuery } from './resources-action-creators';

export function repositoryClear() {
  return {
    type: actionTypes.REPOSITORY_CLEAR
  };
}

export function repositoryAdd(entity) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.REPOSITORY_ADD,
      entity
    });

    dispatch(resourcesEntityQuery(entity));
  };
}

export function repositoryRemove(id) {
  return {
    type: actionTypes.REPOSITORY_REMOVE,
    id
  };
}
'use strict';

import AppConstants from '../constants/app-constants';
import { resourcesEntityQuery } from './resources-action-creators';

export function repositoryClear() {
  return {
    type: AppConstants.ActionTypes.REPOSITORY_CLEAR
  };
}

export function repositoryAdd(entity) {
  return (dispatch) => {
    dispatch({
      type: AppConstants.ActionTypes.REPOSITORY_ADD,
      entity
    });

    dispatch(resourcesEntityQuery(entity));
  };
}

export function repositoryRemove(id) {
  return {
    type: AppConstants.ActionTypes.REPOSITORY_REMOVE,
    id
  };
}
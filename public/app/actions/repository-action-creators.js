'use strict';

import AppDispatcher from '../compat/dispatcher';
import AppConstants from '../constants/app-constants';
import { resourcesEntityQuery } from './resources-action-creators';

export function repositoryClear() {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.REPOSITORY_CLEAR
  });
}

export function repositoryAdd(entity) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.REPOSITORY_ADD,
    entity
  });

  resourcesEntityQuery(entity);
}

export function repositoryRemove(id) {
  AppDispatcher.dispatch({
    type: AppConstants.ActionTypes.REPOSITORY_REMOVE,
    id
  });
}
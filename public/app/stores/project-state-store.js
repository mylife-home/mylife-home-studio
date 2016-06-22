'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

class ProjectStateStore extends EventEmitter {

  constructor() {
    super();
    this.states = new Map();
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    switch(action.type) {
      case AppConstants.ActionTypes.PROJECT_LOAD:
        this.emitChange();
        break;

      case AppConstants.ActionTypes.PROJECT_CLOSE:
        this.states.delete(action.project.id);
        this.emitChange();
        break;

      case AppConstants.ActionTypes.PROJECT_STATE_REFRESH:
        this.emitChange();
        break;
    }
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  getProjectState(project) {
    let state = this.states.get(project.id);
    if(state) { return state; }
    this.states.set(project.id, (state = {}));
    return state;
  }
};

export default new ProjectStateStore();
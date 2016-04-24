'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

class ProjectStore extends EventEmitter {

  constructor() {
    super();
    this.error = null;
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    switch(action.type) {
      case AppConstants.ActionTypes.PROJECT_NEW:
        // TODO
        console.log('new', action.projectType);
        this.emitChange();
        break;

      case AppConstants.ActionTypes.PROJECT_OPEN:
        // TODO
        console.log('open', action.projectType, action.projectContent);
        this.emitChange();
        break;
    }
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getAll() {
    // TODO
  }
};

export default new ProjectStore();
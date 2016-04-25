'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

class ProjectStore extends EventEmitter {

  constructor() {
    super();
    this.projects = new Map();
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    switch(action.type) {
      case AppConstants.ActionTypes.PROJECT_LOAD:
        {
          const project = action.project;
          this.projects.set(project.id, project);
          this.emitChange();
        }
        break;
      case AppConstants.ActionTypes.PROJECT_CLOSE:
        {
          const project = action.project;
          this.projects.delete(project.id);
          this.emitChange();
        }
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
    return Array.from(this.projects.values());
  }
};

export default new ProjectStore();
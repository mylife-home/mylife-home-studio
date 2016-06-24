'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

const DEFAULT_TAB = 'online';

class ActiveTabStore extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(0);
    this.activeTab = DEFAULT_TAB;
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    switch(action.type) {
      case AppConstants.ActionTypes.PROJECT_LOAD:
        this.activeTab = action.project.id;
        this.emitChange();
        break;

      case AppConstants.ActionTypes.PROJECT_CLOSE:
        if(action.project.id !== this.activeTab) { return; }
        this.activeTab = DEFAULT_TAB;
        this.emitChange();
        break;

      case AppConstants.ActionTypes.TAB_ACTIVATE:
        this.activeTab = action.id;
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

  getActiveTab() {
    return this.activeTab;
  }
};

export default new ActiveTabStore();
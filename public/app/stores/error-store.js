'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

class ErrorStore extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(0);
    this.error = null;
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    switch(action.type) {
      case AppConstants.ActionTypes.DIALOG_ERROR:
        this.error = action.error;
        this.emitChange();
        break;

      case AppConstants.ActionTypes.DIALOG_ERROR_CLEAN:
        this.error = null;
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

  get() {
    return this.error;
  }

  isError() {
    return !!this.error;
  }
};

export default new ErrorStore();
'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

class BusyStore extends EventEmitter {

  constructor() {
    super();
    this.busyText = null;
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    switch(action.type) {
      case AppConstants.ActionTypes.DIALOG_SET_BUSY:
        this.busyText = action.text;
        this.emitChange();
        break;

      case AppConstants.ActionTypes.DIALOG_UNSET_BUSY:
        this.busyText = null;
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
    return this.busyText;
  }

  isBusy() {
    return !!this.busyText;
  }
};

export default new BusyStore();
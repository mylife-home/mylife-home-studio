'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';
import reducer from '../reducers/busyText';

const CHANGE_EVENT = 'change';

class BusyStore extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(0);
    this.busyText = reducer(undefined, {});
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    const old = this.busyText;
    this.busyText = reducer(this.busyText, action);
    if(old !== this.busyText) { this.emitChange(); }
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
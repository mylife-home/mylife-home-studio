'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';
import reducer from '../reducers/error';

const CHANGE_EVENT = 'change';

class ErrorStore extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(0);
    this.error = reducer(undefined, {});
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    const old = this.error;
    this.error = reducer(this.error, action);
    if(old !== this.error) { this.emitChange(); }
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
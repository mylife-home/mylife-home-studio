'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';
import reducer from '../reducers/dialogs';

const CHANGE_EVENT = 'change';

const DEFAULT_TAB = 'online';

class DialogsStore extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(0);
    this.state = reducer(undefined, {});
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    const old = this.state;
    this.state = reducer(this.state, action);
    if(old !== this.state) { this.emitChange(); }
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
    return this.state;
  }

  getBusyText() {
    return this.state.busyText;
  }

  isBusy() {
    return !!this.state.busyText;
  }

  getError() {
    return this.state.error;
  }

  isError() {
    return !!this.state.error;
  }
};

export default new DialogsStore();
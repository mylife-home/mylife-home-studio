'use strict';

import AppDispatcher from '../compat/dispatcher';
import {EventEmitter} from 'events';
import reducer from '../reducers/activeTab';

const CHANGE_EVENT = 'change';

class ActiveTabStore extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(0);
    this.activeTab = reducer(undefined, {});
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    const old = this.activeTab;
    this.activeTab = reducer(this.activeTab, action);
    if(old !== this.activeTab) { this.emitChange(); }
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
}

export default new ActiveTabStore();
'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import {EventEmitter} from 'events';
import reducer from '../reducers/projects';

const CHANGE_EVENT = 'change';

class ProjectStore extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(0);
    this.state = reducer(undefined, {});
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    console.log('handleDispatch', action);
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

  getAll() {
    return Array.from(this.state.projects.toArray());
  }

  get(uid) {
    return this.state.projects.get(uid);
  }

  getProjectState(project) {
    return this.state.states.get(project.uid);
  }
}

export default new ProjectStore();
'use strict';

import AppDispatcher from '../compat/dispatcher';
import {EventEmitter} from 'events';
import reducer from '../reducers/online';

const CHANGE_EVENT = 'change';

class OnlineStore extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(0);
    this.entities = reducer(undefined, {});
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    const old = this.entities;
    this.entities = reducer(this.entities, action);
    if(old !== this.entities) { this.emitChange(); }
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

  get(id) {
    return this.entities.get(id);
  }

  getAll() {
    return Array.from(this.entities.toArray());
  }

  getResourceEntity() {
    return Array.from(this.entities.toArray()).find(e => e.resources);
  }

  getResourceNames(startsWith) {
    const resourcesEntity = this.getResourceEntity();
    if(!resourcesEntity) { return []; }
    const names = resourcesEntity.resources;
    if(!startsWith) { return names; }
    return names.filter(n => n.startsWith(startsWith));
  }
}

export default new OnlineStore();
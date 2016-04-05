'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import AppConstants from '../constants/app-constants';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

class OnlineStore extends EventEmitter {

  constructor() {
    super();
    this.entities = new Map();
    this.dispatchToken = AppDispatcher.register(this.handleDispatch.bind(this));
  }

  handleDispatch(action) {
    let entity;

    switch(action.type) {
      case AppConstants.ActionTypes.REPOSITORY_CLEAR:
        this.entities.clear();
        this.emitChange();
        break;

      case AppConstants.ActionTypes.REPOSITORY_ADD:
        entity = action.entity;
        this.entities.set(entity.id, entity);
        this.emitChange();
        break;

      case AppConstants.ActionTypes.REPOSITORY_REMOVE:
        this.entities.delete(action.id);
        this.emitChange();
        break;

      case AppConstants.ActionTypes.ENTITY_RESOURCES_LIST:
        entity = this.entities.get(action.entityId);
        if(!entity) { return; }
        entity.resources = action.resources;
        this.emitChange();
        break;

      case AppConstants.ActionTypes.ENTITY_PLUGINS_LIST:
        entity = this.entities.get(action.entityId);
        if(!entity) { return; }
        entity.plugins = action.plugins;
        this.emitChange();
        break;

      case AppConstants.ActionTypes.ENTITY_COMPONENTS_LIST:
        entity = this.entities.get(action.entityId);
        if(!entity) { return; }
        entity.components = action.components;
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

  get(id) {
    return this.entities.get(id);
  }

  getAll() {
    return Array.from(this.entities.values());
  }
};

export default new OnlineStore();
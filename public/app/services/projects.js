'use strict';

import uuid from 'uuid';
import debugLib from 'debug';
import RepositoryActionCreators from '../actions/repository-action-creators';

const debug = debugLib('mylife:home:studio:services:projects');

class Project {
  constructor(type, data) {
    this._type = type;
    this._data = data || {};
    this._id   = uuid.v4();

    console.log('project created', this._id, this._data);
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get name() {
    return this._data.Name;
  }

  set name(value) {
    this._data.Name = value;
  }

};

class Projects {
  constructor() {
  }

  new(type) {
    return new Project(type);
  }

  open(type, content) {
    const data = JSON.parse(content);
    return new Project(type, data);
  }
}

export default Projects;
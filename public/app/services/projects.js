'use strict';

import uuid from 'uuid';
import debugLib from 'debug';
import RepositoryActionCreators from '../actions/repository-action-creators';

const debug = debugLib('mylife:home:studio:services:projects');

class Project {
  constructor(type, data) {
    this._type  = type;
    this._data  = data || {};
    this._id    = uuid.v4();
    this._dirty = false;

    console.log('project created', this._id, this._data);
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get dirty() {
    return this._dirty;
  }

  _change() {
    this._dirty = true;
  }

  _save() {
    this._dirty = false;
  }

  get name() {
    return this._data.Name;
  }

  set name(value) {
    if(this._data.Name === value) { return; }
    this._data.Name = value;
    this._change();
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

  save(project, serializer, done) {
    try {
      this.validate(project);
    } catch(err) {
      return done(err);
    }

    const data = project._data;
    const content = JSON.stringify(data);
    serializer(project.name, content, (err) => {
      if(err) { return done(err); }
      project._save();
      return done();
    });
  }

  validate(project) {
    const msgs = [];

    if(!project.name) { msgs.push('No name given'); }

    if(!msgs.length) { return; }

    const err = new Error('Project is not valid');
    err.validationErrors = msgs;
    throw err;
  }
}

export default Projects;
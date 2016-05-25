'use strict';

import uuid from 'uuid';

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

export default Project;
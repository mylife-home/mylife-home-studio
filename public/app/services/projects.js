'use strict';

import debugLib from 'debug';
import RepositoryActionCreators from '../actions/repository-action-creators';

const debug = debugLib('mylife:home:studio:services:projects');

class Project {
  constructor(type, data) {
    this.type = type;
    this.data = data || {};
    console.log('project created', data);
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
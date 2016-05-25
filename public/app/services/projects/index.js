'use strict';

import debugLib from 'debug';
import RepositoryActionCreators from '../../actions/repository-action-creators';

import Project from './project';

const debug = debugLib('mylife:home:studio:services:projects');

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
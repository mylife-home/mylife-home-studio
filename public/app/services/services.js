'use strict';

import debugLib from 'debug';
import request from 'superagent';

const debug = debugLib('mylife:home:studio:services:services');

class Services {
  constructor() {
  }

  pluginRepository(done) {
    debug('pluginRepository()');
    request
      .get('/services/plugin-repository')
      .end((err, res) => {
        if(err) { return done(err); }
        return done(null, res.body);
      });
}

export default Services;
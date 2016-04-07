'use strict';

import debugLib from 'debug';
import RepositoryActionCreators from '../actions/repository-action-creators';
import request from 'superagent';

const debug = debugLib('mylife:home:studio:services:resources');

class Resources {
  constructor() {
  }

  queryResourcesList(entityId) {
    console.log('queryResourcesList');
    request
      .post('/resources/' + entityId)
      .send({ type : 'enum' })
      .end(function(err, res){
        console.log(err, res);
      });
  }

  queryPluginsList(entityId) {

  }

  queryComponentsList(entityId) {

  }
}

export default Resources;
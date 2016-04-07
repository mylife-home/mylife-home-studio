'use strict';

import debugLib from 'debug';
import request from 'superagent';
import ResourcesActionCreators from '../actions/resources-action-creators';


const debug = debugLib('mylife:home:studio:services:resources');

class Resources {
  constructor() {
  }

  queryResourcesList(entityId) {
    debug('queryResourcesList');
    request
      .post('/resources/' + entityId)
      .send({ type : 'enum' })
      .end(function(err, res){
        if(err) { return console.error(err); }
        ResourcesActionCreators.entityResourcesList(entityId, res.body.data);
      });
  }

  queryPluginsList(entityId) {
    debug('queryPluginsList');
    request
      .post('/resources/' + entityId)
      .send({ type : 'plugins' })
      .end(function(err, res){
        if(err) { return console.error(err); }
        ResourcesActionCreators.entityPluginsList(entityId, res.body.data);
      });
  }

  queryComponentsList(entityId) {
    debug('queryComponentsList');
    request
      .post('/resources/' + entityId)
      .send({ type : 'components' })
      .end(function(err, res){
        if(err) { return console.error(err); }
        ResourcesActionCreators.entityComponentsList(entityId, res.body.data);
      });
  }
}

export default Resources;
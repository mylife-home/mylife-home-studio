'use strict';

import debugLib from 'debug';
import request from 'superagent';
import ResourcesActionCreators from '../actions/resources-action-creators';

const debug = debugLib('mylife:home:studio:services:resources');

class Resources {
  constructor() {
  }

  queryResourcesList(entityId) {
    debug(`queryResourcesList(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'enum' })
      .end(function(err, res){
        if(err) { return console.error(err); }
        ResourcesActionCreators.entityResourcesList(entityId, res.body.data);
      });
  }

  queryPluginsList(entityId) {
    debug(`queryPluginsList(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'plugins' })
      .end(function(err, res){
        if(err) { return console.error(err); }
        ResourcesActionCreators.entityPluginsList(entityId, res.body.data);
      });
  }

  queryComponentsList(entityId) {
    debug(`queryComponentsList(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'components' })
      .end(function(err, res){
        if(err) { return console.error(err); }
        ResourcesActionCreators.entityComponentsList(entityId, res.body.data);
      });
  }

  queryResourceGet(entityId, resourceId) {
    debug(`queryResourceGet(${entityId}, ${resourceId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'get', key: resourceId })
      .end(function(err, res){
        if(err) { return console.error(err); }
        ResourcesActionCreators.resourceGetResult(entityId, resourceId, res.body.data);
      });
  }

  queryResourceSet(entityId, resourceId, resourceContent) {
    debug(`queryResourceSet(${entityId}, ${resourceId}, <content>)`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'set', key: resourceId, value: resourceContent })
      .end(function(err, res){
        if(err) { return console.error(err); }
        ResourcesActionCreators.resourceSetResult(entityId, resourceId);
      });
  }
}

export default Resources;
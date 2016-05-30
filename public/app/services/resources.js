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
      .end((err, res) => {
        if(err) { return console.error(err); }
        ResourcesActionCreators.entityResourcesList(entityId, res.body.data);
      });
  }

  queryPluginsList(entityId, cb) {
    debug(`queryPluginsList(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'plugins' })
      .end((err, res) => {
        if(err) {
          if(!cb) { return console.error(err); }
          return cb(err);
        }
        const data = res.body.data;
        ResourcesActionCreators.entityPluginsList(entityId, data);
        if(cb) { cb(null, data); }
      });
  }

  queryComponentsList(entityId, cb) {
    debug(`queryComponentsList(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'components' })
      .end((err, res) => {
        if(err) {
          if(!cb) { return console.error(err); }
          return cb(err);
        }
        const data = res.body.data;
        ResourcesActionCreators.entityComponentsList(entityId, data);
        if(cb) { cb(null, data); }
      });
  }

  queryResourceGet(entityId, resourceId, cb) {
    debug(`queryResourceGet(${entityId}, ${resourceId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'get', key: resourceId })
      .end((err, res) => {
        if(err) {
          if(!cb) { return console.error(err); }
          return cb(err);
        }
        const data = res.body.data;
        ResourcesActionCreators.resourceGetResult(entityId, resourceId, data);
        if(cb) { cb(null, data); }
      });
  }

  queryResourceSet(entityId, resourceId, resourceContent) {
    debug(`queryResourceSet(${entityId}, ${resourceId}, <content>)`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'set', key: resourceId, value: resourceContent })
      .end((err, res) => {
        if(err) { return console.error(err); }
        ResourcesActionCreators.resourceSetResult(entityId, resourceId);
      });
  }
}

export default Resources;
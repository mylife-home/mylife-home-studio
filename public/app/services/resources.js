'use strict';

import debugLib from 'debug';
import request from 'superagent';

const debug = debugLib('mylife:home:studio:services:resources');

class Resources {
  constructor() {
  }

  querySysInfo(entityId, done) {
    debug(`querySysInfo(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'sysinfo' })
      .end((err, res) => {
        if(err) { return done(err); }
        return done(null, res.body.data);
      });
  }

  queryResourcesList(entityId, done) {
    debug(`queryResourcesList(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'enum' })
      .end((err, res) => {
        if(err) { return done(err); }
        return done(null, res.body.data);
      });
  }

  queryPluginsList(entityId, done) {
    debug(`queryPluginsList(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'plugins' })
      .end((err, res) => {
        if(err) { return done(err); }
        return done(null, res.body.data);
      });
  }

  queryComponentsList(entityId, done) {
    debug(`queryComponentsList(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'components' })
      .end((err, res) => {
        if(err) { return done(err); }
        return done(null, res.body.data);
      });
  }

  queryResourceGet(entityId, resourceId, done) {
    debug(`queryResourceGet(${entityId}, ${resourceId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'get', key: resourceId })
      .end((err, res) => {
        if(err) { return done(err); }
        return done(null, res.body.data);
      });
  }

  queryResourceSet(entityId, resourceId, resourceContent, done) {
    debug(`queryResourceSet(${entityId}, ${resourceId}, <content>)`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'set', key: resourceId, value: resourceContent })
      .end((err/*, res*/) => {
        if(err) { return done(err); }
        return done();
      });
  }

  queryComponentCreate(entityId, component, cb) {
    debug(`queryComponentCreate(${entityId}, ${component.comp_id})`);
    request
      .post('/resources/' + entityId)
      .send({
        type: 'comp_create',
        comp_id: component.comp_id,
        library: component.library,
        comp_type: component.comp_type,
        config: component.config, // array of {key, value}
        designer: component.designer // array of {key, value}
      })
      .end((err, res) => {
        checkResult(err, res, cb);
      });
  }

  queryComponentDelete(entityId, componentId, cb) {
    debug(`queryComponentDelete(${entityId}, ${componentId})`);
    request
      .post('/resources/' + entityId)
      .send({
        type: 'comp_delete',
        comp_id: componentId
      })
      .end((err, res) => {
        checkResult(err, res, cb);
      });
  }

  queryComponentBind(entityId, binding, cb) {
    debug(`queryComponentBind(${entityId}, ${binding.remote_id}.${binding.remote_attribute} -> ${binding.local_id}.${binding.local_action})`);
    request
      .post('/resources/' + entityId)
      .send({
        type: 'comp_bind',
        remote_id: binding.remote_id,
        remote_attribute: binding.remote_attribute,
        local_id: binding.local_id,
        local_action: binding.local_action
      })
      .end((err, res) => {
        checkResult(err, res, cb);
      });
  }

  queryComponentUnbind(entityId, binding, cb) {
    debug(`queryComponentUnbind(${entityId}, ${binding.remote_id}.${binding.remote_attribute} -> ${binding.local_id}.${binding.local_action})`);
    request
      .post('/resources/' + entityId)
      .send({
        type: 'comp_unbind',
        remote_id: binding.remote_id,
        remote_attribute: binding.remote_attribute,
        local_id: binding.local_id,
        local_action: binding.local_action
      })
      .end((err, res) => {
        checkResult(err, res, cb);
      });
  }

  queryCompSetDesigner(entityId, componentId, designer, cb) {
    debug(`queryCompSetDesigner(${entityId}, ${componentId})`);
    request
      .post('/resources/' + entityId)
      .send({
        type: 'comp_set_designer',
        comp_id: componentId,
        designer // array of {key, value}
      })
      .end((err, res) => {
        checkResult(err, res, cb);
      });
  }

  queryUiSessionList(entityId, done) {
    debug(`queryUiSessionList(${entityId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'session_list' })
      .end((err, res) => {
        if(err) { return done(err); }
        return done(null, res.body.data);
      });
  }

  queryUiSessionKill(entityId, sessionId, done) {
    debug(`queryUiSessionKill(${entityId}, ${sessionId})`);
    request
      .post('/resources/' + entityId)
      .send({ type : 'session_kill', sessionId })
      .end((err, res) => {
        if(err) { return done(err); }
        return done(null, res.body.data);
      });
  }
}

function checkResult(err, res, cb) {
  if(!err) {
    if(res.body.type === 'error') {
      err = new Error(res.body.message);
    }
  }
  if(err) {
    if(!cb) { return console.error(err); } // eslint-disable-line no-console
    return cb(err);
  }
  if(cb) { cb(); }
}

export default Resources;
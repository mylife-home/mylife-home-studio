'use strict';

import { actionTypes } from '../constants/index';
import Facade from '../services/facade';

export function dialogError(err) {
  console.log(err); // eslint-disable-line no-console
  return {
    type: actionTypes.DIALOG_ERROR,
    error: err
  };
}

export function dialogErrorClean() {
  return {
    type: actionTypes.DIALOG_ERROR_CLEAN,
  };
}

export function dialogInfo(info) {
  return {
    type: actionTypes.DIALOG_INFO,
    info
  };
}

export function dialogInfoClean() {
  return {
    type: actionTypes.DIALOG_INFO_CLEAN,
  };
}

export function dialogSetBusy(text) {
  return {
    type: actionTypes.DIALOG_SET_BUSY,
    text
  };
}

export function dialogUnsetBusy() {
  return {
    type: actionTypes.DIALOG_UNSET_BUSY,
  };
}

export function dialogOpenOperations(operations) {
  return {
    type: actionTypes.DIALOG_OPEN_OPERATIONS,
    operations
  };
}

export function dialogClearOperations() {
  return {
    type: actionTypes.DIALOG_CLEAR_OPERATIONS,
  };
}

export function dialogExecuteOperations() {
  return (dispatch, getState) => {



// TODO

    // action: { type: 'resourceSet', resourceId, resourceContent }
    //  AppDispatcher.dispatch(resourcesSet(resourceId, resourceContent, done));

/*
function createOperationDeleteBinding(entityId, componentId, binding) {
  return {
    uid: newId(),
    enabled: true,
    description: `Delete binding ${binding.remote_id}.${binding.remote_attribute} -> ${componentId}.${binding.local_action} on entity ${entityId}`,
    action: (done) => {
      return resources.queryComponentUnbind(entityId, {
        remote_id: binding.remote_id,
        remote_attribute: binding.remote_attribute,
        local_id: componentId,
        local_action: binding.local_action
      }, done);
    }
  };
}

function createOperationDeleteComponent(entityId, componentId) {
  return {
    uid: newId(),
    enabled: true,
    description: `Delete component ${componentId} on entity ${entityId}`,
    action: (done) => {
      return resources.queryComponentDelete(entityId, componentId, done);
    }
  };
}

function createOperationCreateComponent(component) {
  return {
    uid: newId(),
    enabled: true,
    description: `Create component ${component.id} on entity ${component.plugin.entityId}`,
    action: (done) => {
      return resources.queryComponentCreate(component.plugin.entityId, {
        comp_id: component.id,
        library: component.plugin.library,
        comp_type: component.plugin.type,
        config: mapToAction(component.config),
        designer: []
      }, done);
    }
  };
}

function createOperationCreateBinding(component, binding) {
  return {
    uid: newId(),
    enabled: true,
    description: `Create binding ${binding.remote.id}.${binding.remote_attribute} -> ${component.id}.${binding.local_action} on entity ${component.plugin.entityId}`,
    action: (done) => {
      return resources.queryComponentBind(component.plugin.entityId, {
        remote_id: binding.remote.id,
        remote_attribute: binding.remote_attribute,
        local_id: component.id,
        local_action: binding.local_action
      }, done);
    }
  };
}

function mapToAction(map) {
  const ret = [];
  for(const key of Object.keys(map)) {
    const value = map[key];
    ret.push({ key, value });
  }
  return ret;
}
*/



    const operations = getState().dialogs.operations.toArray();
    dispatch(dialogClearOperations());

    console.log('executeDeploy', operations); // eslint-disable-line no-console

/*

function executeDeploy(data, done) {
  const operations = data.operations.filter(o => o.enabled);
  console.log('executeDeploy', operations); // eslint-disable-line no-console
  const actions = operations.map(o => o.action);
  async.series(actions, (err) => {
    if(err) { return done(err); }
    return loadOnlineCoreEntities(done);
  });
}
*/

    dispatch(dialogSetBusy('Executing deploy'));
    Facade.projects.executeDeploy({ operations }, (err) => {
      dispatch(dialogSetBusy());
      if(err) { return dispatch(dialogError(err)); }

// TODO: refresh all entities (see project-action-creators.refreshEntities)

      dispatch(dialogInfo({ title: 'Success', lines: ['Deploy done'] }));
    });
  };
}

export function dialogCancelOperations() {
  return dialogClearOperations();
}

export function dialogSetOneOperation(operation, value) {
  return {
    type: actionTypes.DIALOG_SET_ONE_OPERATION,
    operation: operation.uid,
    enabled: value
  };
}

export function dialogSetAllOperations(value) {
  return {
    type: actionTypes.DIALOG_SET_ALL_OPERATIONS,
    enabled: value
  };
}

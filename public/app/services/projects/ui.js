'use strict';

import uuid from 'uuid';
import common from './common';

export default {
  createNew,
  open,
  validate,
  serialize,
  createImage,
  createWindow,
  deleteComponent,
  deleteImage,
  deleteWindow
};

function createNew(project) {
  project.components = [];
  project.images = [];
  project.windows = [];
  project.defaultWindow = null;
}

function open(project, data) {
  data = JSON.parse(JSON.stringify(data));
  project.components = data.Components.map(loadComponent);
  project.images = data.Images.map(loadImage);
  project.windows = data.Windows.map(loadWindow.bind(null, project));
  project.defaultWindow = data.DefaultWindow;
  project.windows.forEach(loadWindowControls.bind(null, project, data));
}

function loadComponent(comp) {
  return {
    id: comp.Id,
    plugin: common.loadPlugin(comp.Plugin)
  };
}

function loadImage(img) {
  return {
    uid: uuid.v4(),
    id: img.Id,
    content: img.Content
  };
}

function loadWindow(project, win) {
  return {
    uid: uuid.v4(),
    id: win.id,
    height: win.height,
    width: win.width,
    style: win.style,
    backgroundResource: findResource(project, win.background_resource_id)
    // load later when all windows exists
    //controls: win.controls.map(loadControl.bind(null, project))
  };
}

function loadWindowControls(project, data, projectWindow, index) {
  const dataWindow = data.Windows[index];
  projectWindow.controls = dataWindow.controls.map(loadControl.bind(null, project));
}

function loadControl(project, ctrl) {
  return {
    uid: uuid.v4(),
    id: ctrl.id,
    height: ctrl.height,
    width: ctrl.width,
    x: ctrl.x,
    y: ctrl.y,
    style: ctrl.style,
    display: loadDisplay(project, ctrl.display),
    text: loadText(project, ctrl.text),
    primaryAction: loadAction(project, ctrl.primary_action),
    secondaryAction: loadAction(project, ctrl.secondary_action)
  }
}

function loadDisplay(project, disp) {
  if(!disp) { return null; }
  return {
    component: findComponent(project, disp.component_id),
    attribute: disp.component_attribute,
    defaultResource: findResource(project, disp.default_resource_id),
    map: disp.map.map(loadDisplayMapItem.bind(null, project))
  };
}

function loadDisplayMapItem(project, item) {
  return {
    uid: uuid.v4(),
    max: item.max,
    min: item.min,
    resource: findResource(project, item.resource_id),
    value: item.value
  };
}

function loadText(project, text) {
  if(!text) { return null; }
  return {
    format: text.format,
    context: text.context.map(loadTextContextItem.bind(null, project))
  };
}

function loadTextContextItem(project, item) {
  return {
    uid: uuid.v4(),
    component: findComponent(project, item.component_id),
    attribute: item.component_attribute,
    id: item.id
  };
}

function loadAction(project, action) {
  if(!action) { return null; }
  return {
    component: loadActionComponent(project, action.component),
    window: loadActionWindow(project, action.window)
  }
}

function loadActionComponent(project, actionComponent) {
  if(!actionComponent) { return null; }
  return {
    component: findComponent(project, actionComponent.component_id),
    action: actionComponent.component_action
  };
}

function loadActionWindow(project, actionWindow) {
  if(!actionWindow) { return null; }
  return {
    window: findWindow(project, actionWindow.id),
    popup: actionWindow.popup
  };
}

function findResource(project, id) {
  if(!id) { return null; }
  return project.images.find(img => img.id === id) || null;
}

function findComponent(project, id) {
  if(!id) { return null; }
  return project.components.find(comp => comp.id === id) || null;
}

function findWindow(project, id) {
  if(!id) { return null; }
  return project.windows.find(win => win.id === id) || null;
}

function validate(project, msgs) {
  common.validate(project, msgs);
  // TODO
  throw new Error('TODO');
}

function serialize(project) {
  // TODO
  throw new Error('TODO');
}

function createImage(project) {
  const image = {
    uid: uuid.v4(),
    id: `image_${common.uid()}`,
    content: null
  };

  project.images.push(image);
  common.dirtify(project);

  return image;
}

function createWindow(project) {
  const window = {
    uid: uuid.v4(),
    id: `window_${common.uid()}`,
    height: 500,
    width: 500,
    style: '',
    backgroundResource: null,
    controls: []
  };

  project.windows.push(window);
  common.dirtify(project);

  return window;
}

function deleteComponent(project, component) {
  // TODO: usage
  // TODO: delete
}

function deleteImage(project, image) {
  // TODO: usage
  // TODO: delete
}

function deleteWindow(project, window) {
  // TODO: usage
  // TODO: delete
}


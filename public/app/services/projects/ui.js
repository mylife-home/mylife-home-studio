'use strict';

import uuid from 'uuid';
import common from './common';
import Metadata from '../metadata/index';

const metadata = new Metadata(); // TODO: how to use facade ?

let operationId = 0;

export default {
  createNew,
  open,
  validate,
  serialize,
  prepareImportOnline,
  prepareImportVpanelProject,
  executeImport,
  prepareDeploy,
  createImage,
  createWindow,
  createControl,
  deleteComponent,
  deleteImage,
  deleteWindow,
  deleteControl,
  createTextContextItem,
  createDisplayMappingItem
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
  project.defaultWindow = project.windows.find(wnd => wnd.id === data.DefaultWindow);
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

function prepareImportOnline(project, done) {
  return common.loadOnlineCoreEntities((err) => {
    if(err) { return done(err); }

    const onlinePlugins = common.getOnlinePlugins();
    const onlineComponents = common.getOnlineComponents();

    const plugins = Array.from(onlinePlugins.values())
      .map(value => common.loadPlugin(value.plugin, value.entity.id))
      .filter(p => p.usage === metadata.pluginUsage.ui);

    const components = Array.from(onlineComponents.values())
      .map(value => ({
        id: value.component.id,
        plugin: plugins.find(p =>
          p.library === value.component.library &&
          p.type === value.component.type &&
          p.entityId === value.entity.id)
      }))
      .filter(c => c.plugin);

    let data;
    try {
      data = prepareImport(project, components);
    } catch(err) {
      return done(err);
    }

    return done(null, data);
  });
}

function prepareImportVpanelProject(project, vpanelProject) {
  const components = vpanelProject.components
    .filter(c => c.plugin.usage === metadata.pluginUsage.ui)
    .map(c => ({ id: c.id, plugin: c.plugin }));
  return prepareImport(project, components);
}

function prepareImport(project, newComponents) {

  const messages = [];
  const cleaners = [];
  for(const window of project.windows) {
    for(const control of window.controls) {
      for(property of ['primaryAction', 'secondaryAction']) {
        if(!control[property]) { continue; }
        const actionComp = control[property].component;
        if(actionComp && !importIsComponentAction(newComponents, actionComp.component, actionComp.action)) {
          messages.push(` - ${window.id}/${control.id}/${property}`);
          cleaners.push(importPropertyDeleter(control, property));
        }
      }

      if(control.text) {
        for(const item of control.text.context) {
          if(!importIsComponentAttribute(newComponents, item.component, item.attribute)) {
            messages.push(` - ${window.id}/${control.id}/text/${item.id}`);
            cleaners.push(importArrayItemDeleter(control.text.context, item));
          }
        }
      }

      if(control.display && !importIsComponentAttribute(newComponents, control.display.component, control.display.attribute)) {
        messages.push(` - ${window.id}/${control.id}/display`);
        cleaners.push(importPropertyDeleter(control.display, 'component'));
        cleaners.push(importPropertyDeleter(control.display, 'attribute'));
      }
    }
  }

  return {
    project,
    newComponents,
    messages,
    cleaners
  };
}

function importIsComponentAction(newComponents, oldComponent, actionName) {
  if(!oldComponent) { return true; }
  const comp = newComponents.find(c => c.id === oldComponent.id);
  if(!comp) { return false; }
  if(!actionName) { return true; }
  const action = comp.plugin.clazz.actions.find(a => a.name === actionName);
  if(!action) { return false; }
  if(action.types.length > 0) { return false; }
  return true;
}

function importIsComponentAttribute(newComponents, oldComponent, attributeName) {
  if(!oldComponent) { return true; }
  const comp = newComponents.find(c => c.id === oldComponent.id);
  if(!comp) { return false; }
  if(!attributeName) { return true; }
  const attribute = comp.plugin.clazz.attributes.find(a => a.name === attributeName);
  if(!attribute) { return false; }
  const oldAttribute = oldComponent.plugin.clazz.attributes.find(a => a.name === attributeName);
  if(attribute.type !== oldAttribute.type) { return false; }
  return true;
}

function importPropertyDeleter(object, property) {
  return () => {
    object[property] = null;
  };
}

function importArrayItemDeleter(array, item) {
  return () => {
    arrayRemoveValue(context, item);
  };
}

function executeImport(data) {

  for(const cleaner of data.cleaners) {
    cleaner();
  }

  for(const newComponent of data.newComponents) {
    const actualComponent = data.project.components.find(c => c.id === newComponent.id);
    if(actualComponent) {
      actualComponent.plugin = newComponent.plugin;
      continue;
    }

    data.project.components.push(newComponent);
  }

  common.dirtify(data.project);
}

function prepareDeploy(project, done) {
  return common.loadOnlineResourceNames((err, names) => {
    if(err) { return done(err); }

    let operations;
    try {
      common.checkSaved(project);

console.log(names);
      // TODO
      throw new Error('TODO');
    } catch(err) {
      return done(err);
    }

    return done(null, { project, operations });
  });
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

function createControl(project, window, location, type) {
  const height = 50;
  const width = 50;
  const x = location.x / window.width;
  const y = location.y / window.height;

  const control = {
    uid: uuid.v4(),
    id: `control_${common.uid()}`,
    height,
    width,
    x,
    y,
    style: '',
    text: null,
    display: null,
    primaryAction: null,
    secondaryAction: null
  };

  switch(type) {
    case 'text':
      control.text = {
        format: '',
        context: []
      };
      break;

    case 'image':
      control.display = {
        component: null,
        attribute: null,
        defaultResource: null,
        map: []
      };
      break;

    default:
        throw new Error(`Unsupported control type: ${type}`);
  }

  window.controls.push(control);
  common.dirtify(project);

  return control;
}

function deleteComponent(project, component) {
  const id = component.id;
  const usage = [];
  for(const window of project.windows) {
    for(const control of window.controls) {
      for(property of ['primaryAction', 'secondaryAction']) {
        if(!control[property]) { continue; }
        const actionComp = control[property].component;
        if(actionComp && actionComp.component && actionComp.component.id === id) {
          usage.push(` - ${window.id}/${control.id}/${property}`);
        }
      }

      if(control.text) {
        for(const item of control.text.context) {
          if(item.component.id === id) {
            usage.push(` - ${window.id}/${control.id}/text/${item.id}`);
          }
        }
      }

      if(control.display &&
         control.display.component &&
         control.display.component.id == id) {
        usage.push(` - ${window.id}/${control.id}/display`);
      }
    }
  }

  if(usage.length) {
    throw new Error(`The component ${component.id} is used:\n` + usage.join('\n'));
  }

  arrayRemoveValue(project.components, component);
  common.dirtify(project);
}

function deleteImage(project, image) {
  const uid = image.uid;
  const usage = [];
  for(const window of project.windows) {
    if(window.backgroundResource && window.backgroundResource.uid === uid) {
      usage.push(` - ${window.id}/backgroundResource`);
    }

    for(const control of window.controls) {
      if(control.display) {
        if(control.display.defaultResource && control.display.defaultResource.uid === uid) {
          usage.push(` - ${window.id}/${control.id}/defaultResource`);
        }

        for(const item of control.display.map) {
          if(item.resource.uid === uid) {
            usage.push(` - ${window.id}/${control.id}/display/mapping`);
            break;
          }
        }
      }
    }
  }

  if(usage.length) {
    throw new Error(`The image ${image.id} is used:\n` + usage.join('\n'));
  }

  arrayRemoveValue(project.images, image);
  common.dirtify(project);
}

function deleteWindow(project, window) {
  const uid = window.uid;
  const usage = [];
  if(project.defaultWindow && project.defaultWindow.uid === uid) {
    usage.push(' - defaultWindow');
  }
  for(const iterWindow of project.windows) {
    for(const control of iterWindow.controls) {
      for(property of ['primaryAction', 'secondaryAction']) {
        if(!control[property]) { continue; }
        const actionWindow = control[property].window;
        if(actionWindow && actionWindow.window && actionWindow.window.uid === uid) {
          usage.push(` - ${iterWindow.id}/${control.id}/${property}`);
        }
      }
    }
  }

  if(usage.length) {
    throw new Error(`The window ${window.id} is used:\n` + usage.join('\n'));
  }

  arrayRemoveValue(project.windows, window);
  common.dirtify(project);
}

function deleteControl(project, window, control) {
  arrayRemoveValue(window.controls, control);
  common.dirtify(project);
}

function createTextContextItem() {
  return {
    uid: uuid.v4(),
    id: null,
    component: null,
    attribute: null
  };
}

function createDisplayMappingItem() {
  return {
    uid: uuid.v4(),
    max: null,
    min: null,
    resource: null,
    value: null
  };
}

function arrayRemoveValue(arr, value) {
  const index = arr.indexOf(value);
  if(index === -1) { return false; }
  arr.splice(index, 1);
  return true;
}

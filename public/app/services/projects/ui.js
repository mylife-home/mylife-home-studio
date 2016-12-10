'use strict';

import uuid from 'uuid';
import common from './common';
import shared from '../../shared/index';
import OnlineStore from '../../stores/online-store'; // TODO: remove that ?
import Metadata from '../metadata/index';
import Resources from '../resources';

const metadata = new Metadata(); // TODO: how to use facade ?
const resources = new Resources(); // TODO: how to use facade ?

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
  changeImage
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
  };
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
  };
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

  if(!project.defaultWindow) {
    msgs.push('No default window');
  }

  {
    const { noIdCount, duplicates } = common.checkIds(project.images);
    if(noIdCount > 0) {
      msgs.push(`${noIdCount} images have no id`);
    }
    for(const id of duplicates) {
      msgs.push(`Duplicate image id: ${id}`);
    }
  }

  {
    const { noIdCount, duplicates } = common.checkIds(project.windows);
    if(noIdCount > 0) {
      msgs.push(`${noIdCount} windows have no id`);
    }
    for(const id of duplicates) {
      msgs.push(`Duplicate window id: ${id}`);
    }
  }

  for(const window of project.windows) {
    {
      const { noIdCount, duplicates } = common.checkIds(window.controls);
      if(noIdCount > 0) {
        msgs.push(`On window ${window.id}: ${noIdCount} controls have no id`);
      }
      for(const id of duplicates) {
        msgs.push(`On window ${window.id}: duplicate control id: ${id}`);
      }
    }

    for(const control of window.controls) {
      if(control.text) {
        const { noIdCount, duplicates } = common.checkIds(control.text.context);
        if(noIdCount > 0) {
          msgs.push(`On window ${window.id}: on control ${control.id}: ${noIdCount} text context items have no id`);
        }
        for(const id of duplicates) {
          msgs.push(`On window ${window.id}: on control ${control.id}: duplicate text context item id: ${id}`);
        }
      }

      if(control.display && control.display.component) {
        const attributeType = control.display.component.plugin.clazz.attributes.find(a => a.name === control.display.attribute).type;
        if(attributeType.constructor.name === 'Enum') {
          const { noIdCount, duplicates } = common.checkIds(control.display.map, item => item.value);
          if(noIdCount > 0) {
            msgs.push(`On window ${window.id}: on control ${control.id}: ${noIdCount} display map items have no value`);
          }
          for(const value of duplicates) {
            msgs.push(`On window ${window.id}: on control ${control.id}: duplicate display map item value: ${value}`);
          }
        } else { // Range
          const ranges = control.display.map.slice();
          ranges.sort((a, b) => a.min - b.min);
          let prevRange = null;
          for(const range of ranges) {
            if(range.min > range.max) {
              msgs.push(`On window ${window.id}: on control ${control.id}: Range [${range.min}-${range.max}] is invalid`);
              continue;
            }
            if(range.min < attributeType.min || range.max > attributeType.max) {
              msgs.push(`On window ${window.id}: on control ${control.id}: Range [${range.min}-${range.max}] is outside attribute type boundaries [${attributeType.min}-${attributeType.max}]`);
            }
            if(prevRange && range.min <= prevRange.max) {
              msgs.push(`On window ${window.id}: on control ${control.id}: Range [${range.min}-${range.max}] overlap range [${prevRange.min}-${prevRange.max}]`);
            }

            prevRange = range;
          }
        }
      }
    }
  }
}

function serialize(project) {
  common.serialize(project);

  project.raw.Components = project.components.map(serializeComponent);
  project.raw.Images = project.images.map(serializeImage);
  project.raw.Windows = project.windows.map(serializeWindow);
  project.raw.DefaultWindow = serializeObjectId(project.defaultWindow);
}

function serializeObjectId(res) {
  if(!res) { return null; }
  return res.id;
}

function serializeComponent(comp) {
  return {
    Id: comp.id,
    Plugin: {
      library: comp.plugin.library,
      type: comp.plugin.type,
      usage: comp.plugin.usage,
      version: comp.plugin.version,
      config: comp.plugin.rawConfig,
      clazz: comp.plugin.rawClass
    }
  };
}

function serializeImage(img) {
  return {
    Id: img.id,
    Content: img.content
  };
}

function serializeWindow(win) {
  return {
    id: win.id,
    height: win.height,
    width: win.width,
    style: win.style,
    background_resource_id: serializeObjectId(win.backgroundResource),
    controls: win.controls.map(serializeControl)
  };
}

function serializeControl(ctrl) {
  return {
    id: ctrl.id,
    height: ctrl.height,
    width: ctrl.width,
    x: ctrl.x,
    y: ctrl.y,
    style: ctrl.style,
    display: serializeDisplay(ctrl.display),
    text: serializeText(ctrl.text),
    primary_action: serializeAction(ctrl.primaryAction),
    secondary_action: serializeAction(ctrl.secondaryAction)
  };
}

function serializeDisplay(disp) {
  if(!disp) { return null; }
  return {
    component_id: serializeObjectId(disp.component),
    component_attribute: disp.attribute,
    default_resource_id: serializeObjectId(disp.defaultResource),
    map: disp.map.map(serializeDisplayMapItem)
  };
}

function serializeDisplayMapItem(item) {
  return {
    max: item.max,
    min: item.min,
    resource_id: serializeObjectId(item.resource),
    value: item.value
  };
}

function serializeText(text) {
  if(!text) { return null; }
  return {
    format: text.format,
    context: text.context.map(serializeTextContextItem)
  };
}

function serializeTextContextItem(item) {
  return {
    component_id: serializeObjectId(item.component),
    component_attribute: item.attribute,
    id: item.id
  };
}

function serializeAction(action) {
  if(!action) { return null; }
  return {
    component: serializeActionComponent(action.component),
    window: serializeActionWindow(action.window)
  };
}

function serializeActionComponent(actionComponent) {
  if(!actionComponent) { return null; }
  return {
    component_id: serializeObjectId(actionComponent.component),
    component_action: actionComponent.action
  };
}

function serializeActionWindow(actionWindow) {
  if(!actionWindow) { return null; }
  return {
    id: serializeObjectId(actionWindow.window),
    popup: actionWindow.popup
  };
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
      for(const property of ['primaryAction', 'secondaryAction']) {
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
    arrayRemoveValue(array, item);
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

      const resources = new Map();
      for(const name of names) {
        // delete all image/window
        // default_window will be reset too below
        if(name.startsWith('image.') || name.startsWith('window.')) {
          resources.set(name, '');
        }
      }

      for(const image of project.images) {
        resources.set(`image.${image.id}`, image.content);
      }

      for(const window of project.windows) {
        const content = JSON.stringify({ window: serializeWindow(window) });
        resources.set(`window.${window.id}`, content);
      }

      resources.set('default_window', project.defaultWindow.id);

      const entity = OnlineStore.getAll().find(e => e.type === shared.EntityType.RESOURCES);
      operations = [];
      for(const [resourceId, resourceContent] of resources.entries()) {
        operations.push(createOperationResourceSet(entity.id, resourceId, resourceContent));
      }
    } catch(err) {
      return done(err);
    }

    return done(null, { project, operations });
  });
}

function createOperationResourceSet(entityId, resourceId, resourceContent) {
  return {
    id: ++operationId,
    enabled: true,
    description: `${resourceContent ? 'Set' : 'Delete'} resource ${resourceId}`,
    action: (done) => {
      return resources.queryResourceSet(entityId, resourceId, resourceContent, done);
    }
  };
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
      for(const property of ['primaryAction', 'secondaryAction']) {
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
      for(const property of ['primaryAction', 'secondaryAction']) {
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

function changeImage(project, image, data) {
  image.content = data;
}

function arrayRemoveValue(arr, value) {
  const index = arr.indexOf(value);
  if(index === -1) { return false; }
  arr.splice(index, 1);
  return true;
}

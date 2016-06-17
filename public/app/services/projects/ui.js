'use strict';

import common from './common';

export default {
  createNew,
  open,
  validate,
  serialize
};

function createNew(project) {
  project.components = [];
  project.images = [];
  project.windows = [];
}

function open(project, data) {
  data = JSON.parse(JSON.stringify(data));
  project.components = data.Components.map(loadComponent);
  project.images = data.Images.map(loadImage);
  project.windows = data.Windows.map((win) => loadWindow(win, project));
}

function loadComponent(comp) {
  return {
    id: comp.id,
    plugin: common.loadPlugin(comp.Plugin)
  };
}

function loadImage(img) {

}

function loadWindow(win, project) {
  // TODO: default window project.DefaultWindow

}

function validate(project, msgs) {
  common.validate(project, msgs);
}

function serialize(project) {

}
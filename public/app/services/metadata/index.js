'use strict';

import debugLib from 'debug';

import TypeFactory from './type-factory';

const debug = debugLib('mylife:home:studio:services:metadata');

const pluginUsage = Object.freeze({
  'vpanel' : 1,
  'ui'     : 2,
  'driver' : 3
});

class Metadata {
  constructor() {
  }

  get pluginUsage() {
    return pluginUsage;
  }

  parseType(value) {
    return TypeFactory.parse(value);
  }

  createRange(min, max) {
    return TypeFactory.createRange(min, max);
  }

  createEnum(values) {
    return TypeFactory.createEnum(values);
  }
}

export default Metadata;
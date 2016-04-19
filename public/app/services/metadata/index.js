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

  parseClass(value) {
    const ret = {
      attributes: [],
      actions: []
    };

    const members = value.split('|');
    for(const member of members) {
      const parts = member.substr(1).split(',');
      const name = parts[0];
      const types = parts.splice(1).map(this.parseType.bind(this));
      switch(member[0]) {
      case '=': // attribute
        ret.attributes.push({
          name,
          type: types[0]
        });
        break;
      case '.': // action
        ret.actions.push({
          name,
          types
        });
        break;
      }
    }

    return ret;
  }

  createRange(min, max) {
    return TypeFactory.createRange(min, max);
  }

  createEnum(values) {
    return TypeFactory.createEnum(values);
  }
}

export default Metadata;
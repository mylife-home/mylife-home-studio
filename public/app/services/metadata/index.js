'use strict';

//import debugLib from 'debug';

import TypeFactory from './type-factory';

//const debug = debugLib('mylife:home:studio:services:metadata');

const pluginUsage = Object.freeze({
  vpanel : 1,
  ui     : 2,
  driver : 3
});

const configType = Object.freeze({
  string  :  { id: 's', defaultValue: ''},
  integer :  { id: 'i', defaultValue: '0' },
  number  :  { id: 'n', defaultValue: '0' },
  boolean :  { id: 'b', defaultValue: 'false' },
});

class Metadata {
  constructor() {
  }

  get pluginUsage() {
    return pluginUsage;
  }

  get configType() {
    return configType;
  }

  getConfigTypeName(value) {
    for(const name of Object.keys(configType)) {
      if(configType[name].id === value) {
        return name;
      }
    }
  }

  getConfigTypeDefaultValue(value) {
    const name = this.getConfigTypeName(value);
    return configType[name].defaultValue;
  }

  parseType(value) {
    return TypeFactory.parse(value);
  }

  parseClass(value) {
    const ret = {
      attributes: [],
      actions: []
    };

    const members = value.split('|').filter(s => s !== '');
    for(const member of members) {
      const parts = member.substr(1).split(',');
      const name = parts[0];
      const types = parts.splice(1).map(this.parseType, this);
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

  parseConfig(value) {
    return value.
      split('|').
      filter(s => s !== '').
      map(item => {
        const parts = item.split(':');
        return { name: parts[1], type: parts[0] };
      });
  }

  createRange(min, max) {
    return TypeFactory.createRange(min, max);
  }

  createEnum(values) {
    return TypeFactory.createEnum(values);
  }
}

export default Metadata;
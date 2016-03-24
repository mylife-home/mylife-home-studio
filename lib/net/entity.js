'use strict';

const shared = require('../shared');

class Entity {

  constructor(id, host, type) {
    this.id = id;
    this.host = host;
    this.type = type;
  }

  static create(nick) {
    const pos = nick.indexOf('_');
    if(pos === -1 ) { return new Entity(nick, nick, shared.EntityType.UNKNOWN); }

    const stype = nick.substr(0, pos);
    const host = nick.substr(pos + 1);
    const type = readType(stype);
    return new Entity(nick, host, type);
  }

}

module.exports = Entity;

function readType(stype) {
  switch(stype) {
    case 'mylife-home-core'      : return shared.EntityType.CORE;
    case 'mylife-home-resources' : return shared.EntityType.RESOURCES;
    case 'mylife-home-ui'        : return shared.EntityType.UI;
  }

  return shared.EntityType.UNKNOWN;
}

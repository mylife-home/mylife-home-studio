'use strict';

const EntityType = require('./entity-type');

class Entity {

  constructor(id, host, type) {
    this.id = id;
    this.host = host;
    this.type = type;
  }

  static create(nick) {
    const pos = nick.indexOf('_');
    if(pos === -1 ) { return new Entity(nick, nick, EntityType.UNKNOWN); }

    const stype = nick.substr(0, pos);
    const host = nick.substr(pos + 1);
    const type = readType(stype);
    return new Entity(nick, host, type);
  }

}

module.exports = Entity;

function readType(stype) {
  switch(stype) {
    case 'mylife-home-core'      : return EntityType.CORE;
    case 'mylife-home-resources' : return EntityType.RESOURCES;
    case 'mylife-home-ui'        : return EntityType.UI;
  }

  return EntityType.UNKNOWN;
}

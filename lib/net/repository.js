'use strict';

const EventEmitter = require('events');
const common       = require('mylife-home-common');
const Entity       = require('./entity');

module.exports = class Repository extends EventEmitter {

  constructor(ircClient) {
    super();
    this.setMaxListeners(0); // add/remove for eaxch web session

    this._irc = ircClient.irc;

    this._entities = new Map();

    this._irc.on('names',(c, u) => { this._reset(Object.keys(u)); });
    this._irc.on('join', (c, n) => { this._add(n); });
    this._irc.on('nick', this._change.bind(this));
    this._irc.on('part', (c, n) => { this._remove(n); });
    this._irc.on('kick', (c, n) => { this._remove(n); });
    this._irc.on('kill', this._remove.bind(this));
    this._irc.on('quit', this._remove.bind(this));
  }

  get entities () {
    return Array.from(this._entities.values());
  }

  getEntity(id) {
    return this._entities.get(id);
  }

  _reset(nicks) {
    this._clear();
    for(let nick of nicks) {
      this._add(nick);
    }
  }

  _clear() {
    this._entities.clear();
    this.emit('clear');
  }

  _add(nick) {
    if(nick === this._irc.nick) { return; }
    const entity = Entity.create(nick);
    this._entities.set(entity.id, entity);
    this.emit('add', entity.id, entity);
  }

  _remove(nick) {
    if(nick === this._irc.nick) { return; }
    const entity = this._entities.get(nick);
    if(!entity) { return; }
    this._entities.delete(entity.id);
    this.emit('remove', entity.id, entity);
  }

  _change(oldNick, newNick) {
    if(oldNick === this._irc.nick) { return; }
    if(newNick === this._irc.nick) { return; }

    this._remove(oldNick);
    this._add(newNick);
  }
};

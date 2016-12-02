'use strict';

import io from 'socket.io-client';
import debugLib from 'debug';
import { repositoryClear, repositoryAdd, repositoryRemove } from '../actions/index';

const debug = debugLib('mylife:home:studio:services:repository');

class Repository {
  constructor() {
    this.socket = io();
    this.socket.on('connect', ( ) => { debug('socket connected'); });
    this.socket.on('error',   (e) => { debug('socket error: ' + e); });

    this.socket.on('repository:clear', () => repositoryClear());
    this.socket.on('repository:add', (entity) => repositoryAdd(entity));
    this.socket.on('repository:remove', (id) => repositoryRemove(id));
  }
}

export default Repository;
'use strict';

import io from 'socket.io-client';
import debugLib from 'debug';
import RepositoryActionCreators from '../actions/repository-action-creators';

const debug = debugLib('mylife:home:studio:services:repository');

class Repository {
  constructor() {
    this.socket = io();
    this.socket.on('connect', ( ) => { debug('socket connected'); });
    this.socket.on('error',   (e) => { debug('socket error: ' + e); });

    this.socket.on('repository:clear', RepositoryActionCreators.clear);
    this.socket.on('repository:add', RepositoryActionCreators.add);
    this.socket.on('repository:remove', RepositoryActionCreators.remove);
  }
}

export default Repository;
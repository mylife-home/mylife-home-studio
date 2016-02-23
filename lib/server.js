'use strict';

const os           = require('os');
const async        = require('async');
const common       = require('mylife-home-common');
const web          = require('./web');
const net          = require('./net');

module.exports = class {
  constructor(config) {
    this._webServer = new web.Server(config.web.port);
  }

  close(cb) {
    const array = [
      (cb) => this._webServer.close(cb)
    ];

    async.parallel(array, cb);
  }
};
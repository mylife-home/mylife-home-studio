'use strict';

const os           = require('os');
const async        = require('async');
const common       = require('mylife-home-common');
const web          = require('./web');
const net          = require('./net');

module.exports = class {

  constructor(config) {
    const netConfig     = config.net;
    this._netConfig     = netConfig;
    this._adminAgent    = new common.net.Client(netConfig, this._adminNick(), [netConfig.admin_channel]);
    this._repository    = new net.Repository(this._adminAgent);
    this._jpacketClient = new common.net.jpacket.Client(this._adminAgent);
    this._webServer     = new web.Server(this._repository, this._jpacketClient, config.web.port);
  }

  _adminNick() {
    return 'mylife-home-studio_' + os.hostname().split('.')[0];
  }

  close(cb) {
    const array = [
      (cb) => this._webServer.close(cb),
      (cb) => this._adminAgent.close(cb)
    ];

    async.parallel(array, cb);
  }
};
'use strict';

const path             = require('path');
const EventEmitter     = require('events');
const http             = require('http');
const express          = require('express');
const enableDestroy    = require('server-destroy');
const bodyParser       = require('body-parser');
const favicon          = require('serve-favicon');
const serveStatic      = require('serve-static');

module.exports = class extends EventEmitter {
  constructor(port) {
    super();
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    const publicDirectory = path.resolve(path.join(__dirname, '../../public'));

    app.use(favicon(path.join(publicDirectory, 'images/favicon.ico')));
    app.use(serveStatic(publicDirectory));

    this._server = http.Server(app);
    enableDestroy(this._server);

    this._server.listen(port);
  }

  close(callback) {
    this._server.close(callback);
    this._server.destroy();
  }
};

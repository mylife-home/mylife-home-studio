'use strict';

const path              = require('path');
const EventEmitter      = require('events');
const http              = require('http');
const io                = require('socket.io');
const express           = require('express');
const enableDestroy     = require('server-destroy');
const bodyParser        = require('body-parser');
const favicon           = require('serve-favicon');
const serveStatic       = require('serve-static');
const createSession     = require('./session');
const createResources   = require('./resources');
const webpack           = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig     = require('../../webpack.config.dev.js');

module.exports = class extends EventEmitter {
  constructor(netRepository, netResources, port, dev) {
    super();
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '100mb' }));

    const publicDirectory = path.resolve(path.join(__dirname, '../../public'));

    if(dev) {
      console.log('setup webpack dev middleware'); // eslint-disable-line no-console
      app.use(webpackMiddleware(webpack(webpackConfig), { publicPath: webpackConfig.output.publicPath }));
    }
    app.use(favicon(path.join(publicDirectory, 'images/favicon.ico')));
    app.use('/resources', createResources(netResources));
    app.use(serveStatic(publicDirectory));

    this._server = http.Server(app);
    enableDestroy(this._server);
    io(this._server).on('connection', createSession.bind(null, netRepository));

    this._server.listen(port);
  }

  close(callback) {
    this._server.close(callback);
    this._server.destroy();
  }
};

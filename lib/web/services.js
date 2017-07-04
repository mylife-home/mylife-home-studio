'use strict';

const express = require('express');
const common  = require('mylife-home-common');

module.exports = function() {

  const router = express.Router();

  router.route('/plugin-repository').get(function(request, response) {
    common.admin.pluginFetcher((err, list) => {
      if(err) { return response.status(500).json(err); }
      response.json(list);
    });
  });

  return router;
};

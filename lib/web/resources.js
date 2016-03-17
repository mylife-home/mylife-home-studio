'use strict';

const express = require('express');

module.exports = function(netResources) {

  const router = express.Router();

  router.route('/:entityId').post(function(request, response) {
    const entityId = request.params.entityId;
    const req = request.body;
    netResources.execute(req, (err, res) => {
      if(err) { return response.status(500).json(err); }
      response.json(res);
    }, entityId);
  });

  return router;
};

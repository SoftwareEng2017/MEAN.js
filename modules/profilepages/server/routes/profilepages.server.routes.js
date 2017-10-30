'use strict';

/**
 * Module dependencies
 */
var profilepagesPolicy = require('../policies/profilepages.server.policy'),
  profilepages = require('../controllers/profilepages.server.controller');

module.exports = function(app) {
  // Profilepages Routes
  app.route('/api/profilepages').all(profilepagesPolicy.isAllowed)
    .get(profilepages.list)
    .post(profilepages.create);

  app.route('/api/profilepages/:profilepageId').all(profilepagesPolicy.isAllowed)
    .get(profilepages.read)
    .put(profilepages.update)
    .delete(profilepages.delete);

  // Finish by binding the Profilepage middleware
  app.param('profilepageId', profilepages.profilepageByID);
};

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Profilepage = mongoose.model('Profilepage'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Profilepage
 */
exports.create = function(req, res) {
  var profilepage = new Profilepage(req.body);
  profilepage.user = req.user;

  profilepage.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profilepage);
    }
  });
};

/**
 * Show the current Profilepage
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var profilepage = req.profilepage ? req.profilepage.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  profilepage.isCurrentUserOwner = req.user && profilepage.user && profilepage.user._id.toString() === req.user._id.toString();

  res.jsonp(profilepage);
};

/**
 * Update a Profilepage
 */
exports.update = function(req, res) {
  var profilepage = req.profilepage;

  profilepage = _.extend(profilepage, req.body);

  profilepage.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profilepage);
    }
  });
};

/**
 * Delete an Profilepage
 */
exports.delete = function(req, res) {
  var profilepage = req.profilepage;

  profilepage.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profilepage);
    }
  });
};

/**
 * List of Profilepages
 */
exports.list = function(req, res) {
  Profilepage.find().sort('-created').populate('user', 'displayName').exec(function(err, profilepages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profilepages);
    }
  });
};

/**
 * Profilepage middleware
 */
exports.profilepageByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Profilepage is invalid'
    });
  }

  Profilepage.findById(id).populate('user', 'displayName').exec(function (err, profilepage) {
    if (err) {
      return next(err);
    } else if (!profilepage) {
      return res.status(404).send({
        message: 'No Profilepage with that identifier has been found'
      });
    }
    req.profilepage = profilepage;
    next();
  });
};

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Schedule = mongoose.model('Schedule'),
  Shift = mongoose.model('Shift'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Schedule
 */
exports.create = function(req, res) {
  var schedule = new Schedule(req.body);
  var shift1 = new Shift(req.body);
  var shift2 = new Shift(req.body);
  var shift3 = new Shift(req.body);

  shift1.hours.push(6);
  shift1.hours.push(12);
  shift2.hours.push(8);
  shift2.hours.push(2);
  shift3.hours.push(6);
  shift3.hours.push(2);



  schedule.user = req.user;
  schedule.monday.push(shift1);
  schedule.monday.push(shift2);
  schedule.monday.push(shift3);

  schedule.tuesday.push(shift1);
  schedule.tuesday.push(shift2);
  schedule.tuesday.push(shift3);

  schedule.wednesday.push(shift1);
  schedule.wednesday.push(shift2);
  schedule.wednesday.push(shift3);

  schedule.thursday.push(shift1);
  schedule.thursday.push(shift2);
  schedule.thursday.push(shift3);

  schedule.friday.push(shift1);
  schedule.friday.push(shift2);
  schedule.friday.push(shift3);

  schedule.saturday.push(shift1);
  schedule.saturday.push(shift2);
  schedule.saturday.push(shift3);

  schedule.sunday.push(shift1);
  schedule.sunday.push(shift2);
  schedule.sunday.push(shift3);

  schedule.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schedule);
    }
  });
};

/**
 * Show the current Schedule
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var schedule = req.schedule ? req.schedule.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  schedule.isCurrentUserOwner = req.user && schedule.user && schedule.user._id.toString() === req.user._id.toString();

  res.jsonp(schedule);
};

/**
 * Update a Schedule
 */
exports.update = function(req, res) {
  var schedule = req.schedule;

  schedule = _.extend(schedule, req.body);

  schedule.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schedule);
    }
  });
};

/**
 * Delete an Schedule
 */
exports.delete = function(req, res) {
  var schedule = req.schedule;

  schedule.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schedule);
    }
  });
};

/**
 * List of Schedules
 */
exports.list = function(req, res) {
  Schedule.find().sort('-created').populate('user', 'displayName').exec(function(err, schedules) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schedules);
    }
  });
};

/**
 * Schedule middleware
 */
exports.scheduleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Schedule is invalid'
    });
  }

  Schedule.findById(id).populate('user', 'displayName').exec(function (err, schedule) {
    if (err) {
      return next(err);
    } else if (!schedule) {
      return res.status(404).send({
        message: 'No Schedule with that identifier has been found'
      });
    }
    req.schedule = schedule;
    next();
  });
};

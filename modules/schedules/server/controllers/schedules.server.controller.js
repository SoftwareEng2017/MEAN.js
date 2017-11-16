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
/*
  exports.createShift = function (req, res){
    var shift = new Shift(req.body);

  }
*/
/**
 * Create a Schedule
 */
exports.create = function(req, res) {
  console.log(req.body);
  var temp = req.body;
  //console.log(temp.users);
  var schedule = new Schedule(req.body);
  var Adriver1 = new Shift(req.body);
  var Adriver2 = new Shift(req.body);
  var Adriver3 = new Shift(req.body);
  var Akitchen1 = new Shift(req.body);
  var Akitchen2 = new Shift(req.body);
  var Akitchen3 = new Shift(req.body);
  var Afront1 = new Shift(req.body);
  var Afront2 = new Shift(req.body);
  var Afront3 = new Shift(req.body);

  var Bdriver1 = new Shift(req.body);
  var Bdriver2 = new Shift(req.body);
  var Bdriver3 = new Shift(req.body);
  var Bkitchen1 = new Shift(req.body);
  var Bkitchen2 = new Shift(req.body);
  var Bkitchen3 = new Shift(req.body);
  var Bfront1 = new Shift(req.body);
  var Bfront2 = new Shift(req.body);
  var Bfront3 = new Shift(req.body);

  /*hours for shifts*/

  /*Sunday thru Wednesday*/
  Adriver1.hours.push('6:00 p.m.');
  Adriver1.hours.push('12:00 a.m');
  Adriver1.whichShift = [1,0,0];
  Adriver2.hours.push('7:00 p.m');
  Adriver2.hours.push('1.00 a.m');
  Adriver2.whichShift = [0,1,0];
  Adriver3.hours.push('6:00 p.m');
  Adriver3.hours.push('1.00 a.m');
  Adriver3.whichShift = [0,0,1];


  /*Thursday thru Saturday*/
  Bdriver1.hours.push('6:00 p.m.');
  Bdriver1.hours.push('12:00 a.m');
  Bdriver1.whichShift = [1,0,0];
  Bdriver2.hours.push('9:00 p.m');
  Bdriver2.hours.push('3.00 a.m');
  Bdriver2.whichShift = [0,1,0];
  Bdriver3.hours.push('6:00 p.m');
  Bdriver3.hours.push('3.00 a.m');
  Bdriver3.whichShift = [0,0,1];


  /*Sunday thru Wednesday*/
  Afront1.hours.push('6:00 p.m.');
  Afront1.hours.push('12:00 a.m');
  Afront1.whichShift = [1,0,0];
  Afront2.hours.push('7:00 p.m');
  Afront2.hours.push('1.00 a.m');
  Afront2.whichShift = [0,1,0];
  Afront3.hours.push('6:00 p.m');
  Afront3.hours.push('1.00 a.m');
  Afront3.whichShift = [0,0,1];


  /*Thursday thru Saturday*/
  Bfront1.hours.push('6:00 p.m.');
  Bfront1.hours.push('12:00 a.m');
  Afront1.whichShift = [1,0,0];
  Bfront2.hours.push('9:00 p.m');
  Bfront2.hours.push('3.00 a.m');
  Afront2.whichShift = [0,1,0];
  Bfront3.hours.push('6:00 p.m');
  Bfront3.hours.push('3.00 a.m');
  Afront3.whichShift = [0,0,1];

  /*Sunday thru Wednesday*/
  Akitchen1.hours.push('5:00 p.m.');
  Akitchen1.hours.push('11:00 p.m');
  Akitchen1.whichShift = [1,0,0];
  Akitchen2.hours.push('7:30 p.m');
  Akitchen2.hours.push('1:30 a.m');
  Akitchen2.whichShift = [0,1,0];
  Akitchen3.hours.push('5:30 p.m');
  Akitchen3.hours.push('1:30 a.m');
  Akitchen3.whichShift = [0,0,1];


  /*Thursday thru Saturday*/
  Bkitchen1.hours.push('5:00 p.m.');
  Bkitchen1.hours.push('11:00 p.m');
  Bkitchen1.whichShift = [1,0,0];
  Bkitchen2.hours.push('9:30 p.m');
  Bkitchen2.hours.push('3:30 a.m');
  Bkitchen2.whichShift = [0,1,0];
  Bkitchen3.hours.push('5:00 p.m');
  Bkitchen3.hours.push('3:30 a.m');
  Bkitchen3.whichShift = [0,0,1];

  /*Assigning shift roles*/

  /*Sunday thru Wednesday*/
  Adriver1.role.push(1);
  Adriver1.role.push(0);
  Adriver1.role.push(0);
  Adriver2.role.push(1);
  Adriver2.role.push(0);
  Adriver2.role.push(0);
  Adriver3.role.push(1);
  Adriver3.role.push(0);
  Adriver3.role.push(0);

  /*Thursday thru Saturday*/
  Bdriver1.role.push(1);
  Bdriver1.role.push(0);
  Bdriver1.role.push(0);
  Bdriver2.role.push(1);
  Bdriver2.role.push(0);
  Bdriver2.role.push(0);
  Bdriver3.role.push(1);
  Bdriver3.role.push(0);
  Bdriver3.role.push(0);

  /*Sunday thru Wednesday*/
  Akitchen1.role.push(0);
  Akitchen1.role.push(1);
  Akitchen1.role.push(0);
  Akitchen2.role.push(0);
  Akitchen2.role.push(1);
  Akitchen2.role.push(0);
  Akitchen3.role.push(0);
  Akitchen3.role.push(1);
  Akitchen3.role.push(0);

  /*Thursday thru Saturday*/
  Bkitchen1.role.push(0);
  Bkitchen1.role.push(1);
  Bkitchen1.role.push(0);
  Bkitchen2.role.push(0);
  Bkitchen2.role.push(1);
  Bkitchen2.role.push(0);
  Bkitchen3.role.push(0);
  Bkitchen3.role.push(1);
  Bkitchen3.role.push(0);

/*Sunday thru Wednesday*/
  Afront1.role.push(0);
  Afront1.role.push(0);
  Afront1.role.push(1);
  Afront2.role.push(0);
  Afront2.role.push(0);
  Afront2.role.push(1);
  Afront3.role.push(0);
  Afront3.role.push(0);
  Afront3.role.push(1);

  /*Thursday thru Saturday*/
  Bfront1.role.push(0);
  Bfront1.role.push(0);
  Bfront1.role.push(1);
  Bfront2.role.push(0);
  Bfront2.role.push(0);
  Bfront2.role.push(1);
  Bfront3.role.push(0);
  Bfront3.role.push(0);
  Bfront3.role.push(1);

  schedule.user = req.user;

  /*monday*/
  /*driver*/
  schedule.monday.push(Adriver1);
  schedule.monday.push(Adriver2);
  schedule.monday.push(Adriver3);
  /*kitchen*/
  schedule.monday.push(Akitchen1);
  schedule.monday.push(Akitchen2);
  schedule.monday.push(Akitchen3);
  /*front*/
  schedule.monday.push(Afront1);
  schedule.monday.push(Afront2);
  schedule.monday.push(Afront3);

  /*tuesday*/
  /*driver*/
  schedule.tuesday.push(Adriver1);
  schedule.tuesday.push(Adriver2);
  schedule.tuesday.push(Adriver3);
  /*kitchen*/
  schedule.tuesday.push(Akitchen1);
  schedule.tuesday.push(Akitchen2);
  schedule.tuesday.push(Akitchen3);
  /*front*/
  schedule.tuesday.push(Afront1);
  schedule.tuesday.push(Afront2);
  schedule.tuesday.push(Afront3);

  /*wednesday*/
  /*driver*/
  schedule.wednesday.push(Adriver1);
  schedule.wednesday.push(Adriver2);
  schedule.wednesday.push(Adriver3);
  /*kitchen*/
  schedule.wednesday.push(Akitchen1);
  schedule.wednesday.push(Akitchen2);
  schedule.wednesday.push(Akitchen3);
  /*front*/
  schedule.wednesday.push(Afront1);
  schedule.wednesday.push(Afront2);
  schedule.wednesday.push(Afront3);

  /*thursday*/
  /*driver*/
  schedule.thursday.push(Bdriver1);
  schedule.thursday.push(Bdriver2);
  schedule.thursday.push(Bdriver3);
  /*kitchen*/
  schedule.thursday.push(Bkitchen1);
  schedule.thursday.push(Bkitchen2);
  schedule.thursday.push(Bkitchen3);
  /*front*/
  schedule.thursday.push(Bfront1);
  schedule.thursday.push(Bfront2);
  schedule.thursday.push(Bfront3);

  /*friday*/
  /*driver*/
  schedule.friday.push(Bdriver1);
  schedule.friday.push(Bdriver2);
  schedule.friday.push(Bdriver3);
  /*kitchen*/
  schedule.friday.push(Bkitchen1);
  schedule.friday.push(Bkitchen2);
  schedule.friday.push(Bkitchen3);
  /*front*/
  schedule.friday.push(Bfront1);
  schedule.friday.push(Bfront2);
  schedule.friday.push(Bfront3);

  /*saturday*/
  /*driver*/
  schedule.saturday.push(Bdriver1);
  schedule.saturday.push(Bdriver2);
  schedule.saturday.push(Bdriver3);
  /*kitchen*/
  schedule.saturday.push(Bkitchen1);
  schedule.saturday.push(Bkitchen2);
  schedule.saturday.push(Bkitchen3);
  /*front*/
  schedule.saturday.push(Bfront1);
  schedule.saturday.push(Bfront2);
  schedule.saturday.push(Bfront3);

  /*sunday*/
  /*driver*/
  schedule.sunday.push(Adriver1);
  schedule.sunday.push(Adriver2);
  schedule.sunday.push(Adriver3);
  /*kitchen*/
  schedule.sunday.push(Akitchen1);
  schedule.sunday.push(Akitchen2);
  schedule.sunday.push(Akitchen3);
  /*front*/
  schedule.sunday.push(Afront1);
  schedule.sunday.push(Afront1);
  schedule.sunday.push(Afront1);

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

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
  var users = temp.users;
  var requirements = temp.requirements;
  //console.log(temp.users);
  var schedule = new Schedule(req.body);
  var shifts = [];
  for(var i = 0; i< 63; i++){
    //create array of each individual shift
    shifts[i] = new Shift(req.body);
  }
  
  for (var j = 0; j <= 27; j+=9){
    //push hours for A type shift
    //0-8 = sun, 9-17 = mon .. . wed
    //driver: open, close, full
    shifts[j].hours.push('6:00 p.m.');
    shifts[j].hours.push('12:00 a.m');
    shifts[j].whichShift = [1,0,0];
    
    shifts[j+1].hours.push('7:00 p.m');
    shifts[j+1].hours.push('1.00 a.m');
    shifts[j+1].whichShift = [0,1,0];
    shifts[j+2].hours.push('6:00 p.m');
    shifts[j+2].hours.push('1.00 a.m');
    shifts[j+2].whichShift = [0,0,1];
    
    shifts[j].required = requirements.open[0];
    shifts[j+1].required = requirements.close[0];
    shifts[j+2].required = requirements.full[0];

    //kitchen
    shifts[j+3].hours.push('5:00 p.m.');
    shifts[j+3].hours.push('11:00 p.m');
    shifts[j+3].whichShift = [1,0,0];
    shifts[j+4].hours.push('7:30 p.m');
    shifts[j+4].hours.push('1:30 a.m');
    shifts[j+4].whichShift = [0,1,0];
    shifts[j+5].hours.push('5:30 p.m');
    shifts[j+5].hours.push('1:30 a.m');
    shifts[j+5].whichShift = [0,0,1];

    shifts[j+3].required = requirements.open[1];
    shifts[j+4].required = requirements.close[1];
    shifts[j+5].required = requirements.full[1];
    //front
    shifts[j+6].hours.push('6:00 p.m.');
    shifts[j+6].hours.push('12:00 a.m');
    shifts[j+6].whichShift = [1,0,0];
    shifts[j+7].hours.push('7:00 p.m');
    shifts[j+7].hours.push('1.00 a.m');
    shifts[j+7].whichShift = [0,1,0];
    shifts[j+8].hours.push('6:00 p.m');
    shifts[j+8].hours.push('1.00 a.m');
    shifts[j+8].whichShift = [0,0,1];

    shifts[j+6].required = requirements.open[2];
    shifts[j+7].required = requirements.close[2];
    shifts[j+8].required = requirements.full[2];

    shifts[j].role.push(1);
    shifts[j].role.push(0);
    shifts[j].role.push(0);
    shifts[j+1].role.push(1);
    shifts[j+1].role.push(0);
    shifts[j+1].role.push(0);
    shifts[j+2].role.push(1);
    shifts[j+2].role.push(0);
    shifts[j+2].role.push(0);

    shifts[j+3].role.push(0);
    shifts[j+3].role.push(1);
    shifts[j+3].role.push(0);
    shifts[j+4].role.push(0);
    shifts[j+4].role.push(1);
    shifts[j+4].role.push(0);
    shifts[j+5].role.push(0);
    shifts[j+5].role.push(1);
    shifts[j+5].role.push(0);

    shifts[j+6].role.push(0);
    shifts[j+6].role.push(0);
    shifts[j+6].role.push(1);
    shifts[j+7].role.push(0);
    shifts[j+7].role.push(0);
    shifts[j+7].role.push(1);
    shifts[j+8].role.push(0);
    shifts[j+8].role.push(0);
    shifts[j+8].role.push(1);
  }
  for (var k = 36; k <= 54; k+=9){
    //thur-sat

    shifts[k].hours.push('6:00 p.m.');
    shifts[k].hours.push('12:00 a.m');
    shifts[k].whichShift = [1,0,0];
    shifts[k+1].hours.push('9:00 p.m');
    shifts[k+1].hours.push('3.00 a.m');
    shifts[k+1].whichShift = [0,1,0];
    shifts[k+2].hours.push('6:00 p.m');
    shifts[k+2].hours.push('3.00 a.m');
    shifts[k+2].whichShift = [0,0,1];

    shifts[k].required = requirements.open[0];
    shifts[k+1].required = requirements.close[0];
    shifts[k+2].required = requirements.full[0];


    shifts[k+3].hours.push('5:00 p.m.');
    shifts[k+3].hours.push('11:00 p.m');
    shifts[k+3].whichShift = [1,0,0];
    shifts[k+4].hours.push('9:30 p.m');
    shifts[k+4].hours.push('3:30 a.m');
    shifts[k+4].whichShift = [0,1,0];
    shifts[k+5].hours.push('5:00 p.m');
    shifts[k+5].hours.push('3:30 a.m');
    shifts[k+5].whichShift = [0,0,1];

    shifts[k+3].required = requirements.open[1];
    shifts[k+4].required = requirements.close[1];
    shifts[k+5].required = requirements.full[1];

    //thur-sat
    shifts[k+6].hours.push('6:00 p.m.');
    shifts[k+6].hours.push('12:00 a.m');
    shifts[k+6].whichShift = [1,0,0];
    shifts[k+7].hours.push('9:00 p.m');
    shifts[k+7].hours.push('3.00 a.m');
    shifts[k+7].whichShift = [0,1,0];
    shifts[k+8].hours.push('6:00 p.m');
    shifts[k+8].hours.push('3.00 a.m');
    shifts[k+8].whichShift = [0,0,1];

    
    shifts[k+6].required = requirements.open[2];
    shifts[k+7].required = requirements.close[2];
    shifts[k+8].required = requirements.full[2];
    
    /*Thursday thru Saturday*/
    

    shifts[k].role.push(1);
    shifts[k].role.push(0);
    shifts[k].role.push(0);
    shifts[k+1].role.push(1);
    shifts[k+1].role.push(0);
    shifts[k+1].role.push(0);
    shifts[k+2].role.push(1);
    shifts[k+2].role.push(0);
    shifts[k+2].role.push(0);

    /*Sunday thru Wednesday*/

    /*Thursday thru Saturday*/
    shifts[k+3].role.push(0);
    shifts[k+3].role.push(1);
    shifts[k+3].role.push(0);
    shifts[k+4].role.push(0);
    shifts[k+4].role.push(1);
    shifts[k+4].role.push(0);
    shifts[k+5].role.push(0);
    shifts[k+5].role.push(1);
    shifts[k+5].role.push(0);
   

    /*Thursday thru Saturday*/
    shifts[k+6].role.push(0);
    shifts[k+6].role.push(0);
    shifts[k+6].role.push(1);
    shifts[k+7].role.push(0);
    shifts[k+7].role.push(0);
    shifts[k+7].role.push(1);
    shifts[k+8].role.push(0);
    shifts[k+8].role.push(0);
    shifts[k+8].role.push(1);

  }
  /*
  var Adriver1 = new Shift(req.body);
  var Adriver2 = new Shift(req.body);
  var Adriver3 = new Shift(req.body);
  var Akitchen1 = new Shift(req.body);
  var Akitchen2 = new Shift(req.body);
  var Akitchen3 = new Shift(req.body);
  var Afront1 = new Shift(req.body);
  var Afront2 = new Shift(req.body);
  var Afront3 = new Shift(req.body);
  ahoulsnt need these anymore
  */
  /*var Bdriver1 = new Shift(req.body);
  var Bdriver2 = new Shift(req.body);
  var Bdriver3 = new Shift(req.body);
  var Bkitchen1 = new Shift(req.body);
  var Bkitchen2 = new Shift(req.body);
  var Bkitchen3 = new Shift(req.body);
  var Bfront1 = new Shift(req.body);
  var Bfront2 = new Shift(req.body);
  var Bfront3 = new Shift(req.body);*/

  /*hours for shifts*/

  /*Sunday thru Wednesday*/
  //check and push availbility
  for(var u = 0; u < users.length; u++) {
    var obj = users[u];
    var availibility = obj.availibility;
    var default_assigned = [0,0,0,0,0,0,0,0,0];
    var pushEmployee = {
      assigned: { 
        mon: default_assigned,
        tue: default_assigned,
        wed: default_assigned,
        thu: default_assigned,
        fri: default_assigned,
        sat: default_assigned,
        sun: default_assigned 
      },
      name: " ",
      id: " "      
    };
    for (var sun = 0; sun <9; sun++){
      if(availibility.sun[sun] === 1){
        console.log(obj.firstName);
        pushEmployee.name = obj.firstName + " " + obj.lastName;
        pushEmployee.id = obj._id;
        shifts[sun].available.push(pushEmployee);
      }
    }
    //check mon avail
    for (var mon = 0; mon < 9; mon++){
      if(availibility.mon[mon] === 1){
        console.log(obj.firstName);
        pushEmployee.name = obj.firstName + " " + obj.lastName;
        pushEmployee.id = obj._id;
        shifts[mon+9].available.push(pushEmployee);
      }
    }
    //tue avail
    for (var tue = 0; tue <9; tue++){
      if(availibility.tue[tue] === 1){
        console.log(obj.firstName);
        pushEmployee.name = obj.firstName + " " + obj.lastName;
        pushEmployee.id = obj._id;
        shifts[tue+18].available.push(pushEmployee);
      }
    }
    for (var wed = 0; wed <9; wed++){
      if(availibility.wed[wed] === 1){
        console.log(obj.firstName);
        pushEmployee.name = obj.firstName + " " + obj.lastName;
        pushEmployee.id = obj._id;
        shifts[wed+27].available.push(pushEmployee);
      }
    }
    for (var thu = 0; thu <9; thu++){
      if(availibility.thu[thu] === 1){
        console.log(obj.firstName);
        pushEmployee.name = obj.firstName + " " + obj.lastName;
        pushEmployee.id = obj._id;
        shifts[thu+36].available.push(pushEmployee);
      }
    }
    for (var fri = 0; fri <9; fri++){
      if(availibility.fri[fri] === 1){
        console.log(obj.firstName);
        pushEmployee.name = obj.firstName + " " + obj.lastName;
        pushEmployee.id = obj._id;
        shifts[fri+45].available.push(pushEmployee);
      }
    }
    for (var sat = 0; sat <9; sat++){
      if(availibility.sat[sat] === 1){
        console.log(obj.firstName);
        pushEmployee.name = obj.firstName + " " + obj.lastName;
        pushEmployee.id = obj._id;
        shifts[sat+54].available.push(pushEmployee);
      }
    }
    //monday driver
  
    //push everything to monday

    //empty the available of each A type shift.
    //tuesday
    console.log(availibility);
  }
  console.log(shifts);
  /*monday*/
  /*driver*/
  for (var m = 0; m<63; m++){
    if (m < 9){
      schedule.sunday.push(shifts[m]);
    }
    else if (m < 18 && m > 8){
      schedule.monday.push(shifts[m]);
    }
    else if (m < 27 && m > 17){
      schedule.tuesday.push(shifts[m]);
    }
    else if (m<36 && m > 26){
      schedule.wednesday.push(shifts[m]);
    }
    else if (m <45 && m > 35){
      schedule.thursday.push(shifts[m]);
    }
    else if (m < 54 && m > 44){
      schedule.friday.push(shifts[m]);
    }
    else if (m < 63 && m > 53){
      schedule.saturday.push(shifts[m]);
    }
  }
  


  /*tuesday*/
  /*driver*/

  /*wednesday*/
  /*driver*/


  /*thursday*/
  /*driver*/

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

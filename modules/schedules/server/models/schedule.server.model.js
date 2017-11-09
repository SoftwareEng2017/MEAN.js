'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Employee = require('../../../users/server/models/user.server.model.js');
var EmployeeSchema = mongoose.model('User').schema;

var shiftSchema = new Schema({

  hours: [{
    type: String
  }],
  employees: [{
    name: { type: String },

    id: { type: String }
  }],

  role: [{
    type: Number
  }],
  whichShift:[{
    type: Number
  }]
});

/**
 * Schedule Schema
 */
var scheduleSchema = new Schema({
  weekName: String,
  monday: [shiftSchema],
  tuesday: [shiftSchema],
  wednesday: [shiftSchema],
  thursday: [shiftSchema],
  friday: [shiftSchema],
  saturday: [shiftSchema],
  sunday: [shiftSchema]

});

var Schedule = mongoose.model('Schedule', scheduleSchema);
var Shift = mongoose.model('Shift', shiftSchema);

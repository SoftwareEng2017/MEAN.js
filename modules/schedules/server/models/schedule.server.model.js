'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var shiftSchema = new Schema({

  hours: [{
    type: Number
  }],
  employees: [{
    type: String
  }],
  role: [{
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

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
  _id: Schema.Types.ObjectId,
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
  mondays: [{
    type: Schema.Types.ObjectId, ref: 'Shift'
  }],
  tuesday: [{
    type: Schema.Types.ObjectId, ref: 'Shift'
  }],
  wednesday: [{
    type: Schema.Types.ObjectId, ref: 'Shift'
  }],
  thursday: [{
    type: Schema.Types.ObjectId, ref: 'Shift'
  }],
  friday: [{
    type: Schema.Types.ObjectId, ref: 'Shift'
  }],
  saturday: [{
    type: Schema.Types.ObjectId, ref: 'Shift'
  }],
  sunday: [{
    type: Schema.Types.ObjectId, ref: 'Shift'
  }]

});

var Schedule = mongoose.model('Schedule', scheduleSchema);
var Shift = mongoose.model('Shift', shiftSchema);

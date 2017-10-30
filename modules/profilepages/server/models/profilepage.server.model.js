'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Profilepage Schema
 */
var ProfilepageSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Profilepage name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Profilepage', ProfilepageSchema);

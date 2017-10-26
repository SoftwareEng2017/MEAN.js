var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shiftSchema = new Schema({
  hours:[{type:Number}],
  _id: Schema.Types.ObjectId,
  employees :[{type: String}],
  role:[{type:Number}]
});

var scheduleSchema = new Schema({
  monday:{
    shifts:[{type:Schema.Types.ObjectId, ref: 'Shift'}]
  },
  tuesday:{
    shifts:[{type:Schema.Types.ObjectId, ref: 'Shift'}]
  },
  wednesday:{
    shifts:[{type:Schema.Types.ObjectId, ref: 'Shift'}]
  },
  thursday:{
    shifts:[{type:Schema.Types.ObjectId, ref: 'Shift'}]
  },
  friday:{
    shifts:[{type:Schema.Types.ObjectId, ref: 'Shift'}]
  },
  saturday:{
    shifts:[{type:Schema.Types.ObjectId, ref: 'Shift'}]
  },
  sunday:{
    shifts:[{type:Schema.Types.ObjectId, ref: 'Shift'}]
  }
});

var Schedule = mongoose.model('Schedule', scheduleSchema);
var Shift = mongoose.model('Shift', shiftSchema);

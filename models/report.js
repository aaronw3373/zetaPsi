var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  body:[],
  author:{
    type: String,
    required: true
  }
});


var Report = mongoose.model('report', reportSchema);

module.exports = Report;

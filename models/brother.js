var mongoose = require('mongoose');

var brotherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  letters:{
    type: String,
    required: false
  },
  year:{
    type: Number,
    required: true
  },
  major:{
    type: String,
    required: false
  },
  email:{
    type: String,
    required: false
  },
  info:{
    type: String,
    required: false
  },
  picture:{
    type: String,
    required: false
  },
  status:{
    type: String,
    required: true
  },
  position:{
    type: String,
    required: false
  }
},
{ timestamps: {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}
});


var Brother = mongoose.model('brother', brotherSchema);

module.exports = Brother;

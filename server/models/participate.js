//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var ParticipateModelSchema = new Schema({
    artist_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }, 
    contest_id  :{ type: mongoose.Schema.Types.ObjectId, ref: 'contest' }, 
    
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });


// Compile model from schema
var Participate = mongoose.model('participate', ParticipateModelSchema, 'participate');

module.exports = Participate;
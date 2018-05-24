//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var MusicModelSchema = new Schema({
    name :String,
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });



// Compile model from schema
var Music = mongoose.model('music_type', MusicModelSchema, 'music_type');

module.exports = Music;
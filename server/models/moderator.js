//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var ModeratorModelSchema = new Schema({
    email: { type: String, required: true, unique: true }, 
    password:{ type: String, required: true, unique: true }, 
    refresh_token: {type: String},
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });


;
// Compile model from schema
var Moderator = mongoose.model('moderator', ModeratorModelSchema, 'moderator');

module.exports = Moderator;
//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var PermissionModelSchema = new Schema({
    name :String,
    description : String,
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

// Compile model from schema
var Pemission = mongoose.model('permission', PermissionModelSchema, 'permission');

module.exports = Pemission;
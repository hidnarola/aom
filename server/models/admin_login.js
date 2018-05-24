//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var AdminModelSchema = new Schema({
    name :String,
    email: { type: String, required: true, unique: true }, 
    password:{ type: String, required: true, unique: true }, 
    permission :[{ type: mongoose.Schema.Types.ObjectId, ref: 'permission' }],
    refresh_token: {type: String},
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });


;
// Compile model from schema
var Admin = mongoose.model('admin_login', AdminModelSchema, 'admin_login');

module.exports = Admin;
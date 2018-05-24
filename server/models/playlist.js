//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var PlaylistModelSchema = new Schema({
    name : String,
    user_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // 7
    audio :[String],
    description : String,
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });



// Compile model from schema
var Playlist = mongoose.model('playlist', PlaylistModelSchema, 'playlist');

module.exports = Playlist;
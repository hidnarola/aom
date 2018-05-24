//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var LikeTrackModelSchema = new Schema({
    track_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'track' }, 
    artist_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }, 
    user_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }, 
    status :{type :String, default: false},
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });


// Compile model from schema
var LikeTrack = mongoose.model('like', LikeTrackModelSchema, 'like');

module.exports = LikeTrack;
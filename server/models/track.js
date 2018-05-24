//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var TrackModelSchema = new Schema({
    artist_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }, // 7
    image :String,
    audio :String,
    music_type :{ type: mongoose.Schema.Types.ObjectId, ref: 'music_type' },
    name : String,
    description : String,
    no_of_votes : {type: Number,default:0},
    no_of_likes : {type: Number,default:0},
    no_of_downloads : {type: Number,default:0},
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });



// Compile model from schema
var Track = mongoose.model('track', TrackModelSchema, 'track');

module.exports = Track;
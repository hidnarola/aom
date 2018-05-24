//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var MediaModelSchema = new Schema({
    music_type :{ type: mongoose.Schema.Types.ObjectId, ref: 'music_type' },
    artist_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }, // 7
    image :String,
    link : String,
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });



// Compile model from schema
var Media = mongoose.model('media', MediaModelSchema, 'media');

module.exports = Media;
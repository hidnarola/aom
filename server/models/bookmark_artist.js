//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var BookmarkModelSchema = new Schema({
    artist_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }, 
    user_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }, 

    created_at: { type: Date, default: Date.now }
}, { versionKey: false });



// Compile model from schema
var Bookmark = mongoose.model('bookmark', BookmarkModelSchema, 'bookmark');

module.exports = Bookmark;
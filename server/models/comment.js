//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var CommentModelSchema = new Schema({
    artist_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }, 
    track_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'track' }, 
    user_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }, 
    comment : String,
    no_of_votes :{type:Number, default:0},
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });


// Compile model from schema
var Comment = mongoose.model('comment', CommentModelSchema, 'comment');

module.exports = Comment;
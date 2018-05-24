//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var VoteCommentModelSchema = new Schema({
    artist_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'artist' }, 
    comment_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }, 
    user_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }, 
    status :{ type: String, enum: ["upvote", "downvote"] }    ,
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });


// Compile model from schema
var Vote_Comment = mongoose.model('vote_comment', VoteCommentModelSchema, 'vote_comment');

module.exports = Vote_Comment;
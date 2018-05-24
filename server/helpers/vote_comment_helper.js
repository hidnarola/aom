
var Vote = require("./../models/vote_comment");
var Track = require("./../models/track");
var comment_helper = {};
var vote_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


vote_helper.upvote_or_down_vote = async (user_id, obj) => {

    let vote = new Vote(obj)
    try {
        let votes = await vote.save();
        return { "status": 1, "message": "Voting done", "vote": votes };

    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting ", "error": err };
    }
};


vote_helper.get_all_voted_user = async (user_id, comment_id) => {
    try {
        var vote = await Vote.find({ "user_id": new ObjectId(user_id), "comment_id": new ObjectId(comment_id)})
        if (vote) {
            return { "status": 1, "message": "vote details found", "vote":  vote.length };
        } else {
            return { "status": 2, "message": "vote not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding vote", "error": err }
    }
};

vote_helper.update_vote_status = async (user_id, comment_id,status) => {

    try {
        var vote = await Vote.findOneAndUpdate({ "user_id": new ObjectId(user_id), "comment_id": new ObjectId(comment_id) },{"status":status})
        if (vote ) {
            return { "status": 1, "message": "vote details found", "vote":  vote };
        } else {
            return { "status": 2, "message": "vote not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding vote", "error": err }
    }
};

module.exports = vote_helper;
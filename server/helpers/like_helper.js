
var Like = require("./../models/like");
var Track = require("./../models/track");
var like_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var moment = require('moment');

like_helper.like_for_track = async (user_id, obj) => {
    let like = new Like(obj)
    try {
        let likes = await like.save();
        return { "status": 1, "message": "like done", "like": likes };

    } catch (err) {
        return { "status": 0, "message": "Error occured while liking ", "error": err };
    }
};


like_helper.get_like = async (user_id, track_id) => {
    try {
        var like = await Like.find({ "user_id": new ObjectId(user_id), "track_id": new ObjectId(track_id) })
        if (like) {
            return { "status": 1, "message": "like details found", "like": like.length };
        } else {
            return { "status": 2, "message": "like not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while like", "error": err }
    }
};

like_helper.update_likes = async (track_id,no_likes) => {

    try {
        var vote = await Track.findOneAndUpdate({"_id": new ObjectId(track_id) },{"no_of_likes":no_likes})
        if (vote ) {
            return { "status": 1, "message": "voting updated", };
        } else {
            return { "status": 2, "message": "vote not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding vote", "error": err }
    }
};


like_helper.get_all_track_by_track_id = async (track_id ) => {
    try {
        var like = await Track
            .find({ "_id": new ObjectId(track_id) })
        if (like) {
            return { "status": 1, "message": "Track details found", "like": like };
        } else {
            return { "status": 2, "message": "track not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding track", "error": err }
    }
}


module.exports = like_helper;
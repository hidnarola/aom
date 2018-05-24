var Comment = require("./../models/comment");
var Vote = require("./../models/vote_comment");
var comment_helper = {};
var vote_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


comment_helper.insert_comment_on_artist = async (object) => {
    let comment = new Comment(object)
    try {
        let data = await comment.save();
        return { "status": 1, "message": "Record inserted", "comment": data };
    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting bookmark", "error": err };
    }
};


comment_helper.get_all_artist_comment_by_user_id = async (user_id) => {
    try {
        var comment = await Comment
            .find({ "user_id": new ObjectId(user_id) })
        if (comment) {
            return { "status": 1, "message": "comment details found", "comment": comment };
        } else {
            return { "status": 2, "message": "comment not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding artist", "error": err }
    }
};

comment_helper.get_all_comment_by_comment_id = async (comment_id ) => {
    try {
        var comment = await Comment
            .find({ "_id": new ObjectId(comment_id) })
        if (comment) {
            return { "status": 1, "message": "comment details found", "comment": comment };
        } else {
            return { "status": 2, "message": "comment not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding artist", "error": err }
    }
};
comment_helper.delete_comment = async (user_id, bookmark_id) => {
    try {
        let comment = await Comment.findOneAndRemove({ user_id: new ObjectId(user_id), _id: new ObjectId(bookmark_id) });
        if (!comment) {
            return { status: 2, message: "Record has not Deleted" };
        } else {
            return { status: 1, message: "Record has been Deleted" };
        }
    } catch (err) {
        return { status: 0,message: "Error occured while deleting comment",error: err };
    }
};

comment_helper.update_votes = async (comment_id,no_votes) => {

    try {
        var vote = await Comment.findOneAndUpdate({"_id": new ObjectId(comment_id) },{"no_of_votes":no_votes})
        if (vote ) {
            return { "status": 1, "message": "voting updated", };
        } else {
            return { "status": 2, "message": "vote not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding vote", "error": err }
    }
};


comment_helper.get_all_comment_by_track = async (artist_id) => {
    console.log("1");
    try {
        var aggregate = [{
            "$match": {
                "artist_id": new ObjectId(artist_id)
            }
        },
           
        ];
        var comment = await Comment.aggregate(aggregate);
        if (comment && comment.length > 0) {
            return { "status": 1, "message": "media found", "comment": comment };
        } else {
            return { "status": 2, "message": "No media available" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding media", "error": err }
    }
}
module.exports = comment_helper;
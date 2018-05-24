var Bookmark = require("./../models/bookmark_artist");
var bookmark_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


bookmark_helper.insert_book_mark_artist = async (object) => {
    let bookmark = new Bookmark(object)
    try {
        let data = await bookmark.save();
        return { "status": 1, "message": "Record inserted", "bookmark": data };
    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting bookmark", "error": err };
    }
};


bookmark_helper.get_all_bookmarked_artist = async (user_id) => {
    try {
        var artist = await Bookmark
            .find({ "user_id": new ObjectId(user_id) })
            .populate('artist')
        if (artist) {
            return { "status": 1, "message": "Artist details found", "artist": artist };
        } else {
            return { "status": 2, "message": "Artist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding artist", "error": err }
    }
};


bookmark_helper.delete_bookmark = async (user_id, bookmark_id) => {
    try {
        let user = await Bookmark.findOneAndRemove({ user_id: new ObjectId(user_id), _id: new ObjectId(bookmark_id) });
        if (!user) {
            return { status: 2, message: "Record has not Deleted" };
        } else {
            return { status: 1, message: "Record has been Deleted" };
        }
    } catch (err) {
        return {status: 0, message: "Error occured while deleting user",error: err};
    }
};

module.exports = bookmark_helper;
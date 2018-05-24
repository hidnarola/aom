var Playlist = require("./../models/playlist");
var playlist_helper = {};
var vote_comment_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


playlist_helper.insert_playlist = async (object) => {
    let playlist = new Playlist(object)
    try {
        let data = await playlist.save();
        return { "status": 1, "message": "Record inserted", "playlist": data };
    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting playlist", "error": err };
    }
};

playlist_helper.get_playlist_by_user_id = async (user_id) => {
    try {
        var aggregate = [{
            "$match": {
                "user_id": new ObjectId(user_id)
            }
        }];
        var playlist = await Playlist.aggregate(aggregate);
        if (playlist && playlist.length > 0) {
            return { "status": 1, "message": "playlist found", "playlist": playlist };
        } else {
            return { "status": 2, "message": "No playlist available" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding playlist", "error": err }
    }
}


playlist_helper.update_playlist = async (user_id, playlist_id,obj) => {

    try {
        var playlist = await Playlist.findOneAndUpdate({ "user_id": new ObjectId(user_id), "_id": new ObjectId(playlist_id) },obj)
        if (playlist ) {
            return { "status": 1, "message": "playlist details found", "playlist":  playlist };
        } else {
            return { "status": 2, "message": "playlist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding playlist", "error": err }
    }
};


playlist_helper.delete_playlist = async (user_id, playlist_id) => {

    try {
        var playlist = await Playlist.findOneAndRemove({ "user_id": new ObjectId(user_id), "_id": new ObjectId(playlist_id) })
        if (playlist ) {
            return { "status": 1, "message": "playlist details found", "playlist":  playlist };
        } else {
            return { "status": 2, "message": "playlist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding playlist", "error": err }
    }
};


module.exports = playlist_helper;
var Purchase = require("./../models/purchased_track");
var purchase_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


purchase_helper.purchase_track = async (object) => {
    let track = new Purchase(object)
    try {
        let data = await track.save();
        return { "status": 1, "message": "Record inserted", "track": data };
    } catch (err) {
        return { "status": 0, "message": "Error occured while purchasing track", "error": err };
    }
};

purchase_helper.get_purchased_track = async (user_id) => {
    try {
        var aggregate = [{
            "$match": {
                "user_id": new ObjectId(user_id)
            }
        }];
        var track = await Purchase.aggregate(aggregate);
        if (track && track.length > 0) {
            return { "status": 1, "message": "media found", "track": track };
        } else {
            return { "status": 2, "message": "No track available" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding track", "error": err }
    }
}
/*purchase_helper.get_all_bookmarked_artist = async (user_id) => {
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
};*/


module.exports = purchase_helper;
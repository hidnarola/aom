var Media = require("./../models/media");
var media_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


media_helper.insert_media = async (object) => {
    let medi = new Media(object)
    try {
        let data = await medi.save();
        return { "status": 1, "message": "Record inserted", "media": data };
    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting media", "error": err };
    }
};


media_helper.get_all_media_of_artist = async (artist_id) => {
    try {
        var aggregate = [{
            "$match": {
                "artist_id": new ObjectId(artist_id)
            }
        }];
        var media = await Media.aggregate(aggregate);
        if (media && media.length > 0) {
            return { "status": 1, "message": "media found", "media": media };
        } else {
            return { "status": 2, "message": "No media available" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding media", "error": err }
    }
}

module.exports = media_helper;
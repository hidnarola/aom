
var Download = require("./../models/download");
var Track = require("./../models/track");

var download_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var moment = require('moment');

download_helper.download_track = async (obj) => {
    let down = new Download(obj)
    try {
        let downloads = await down.save();
        return { "status": 1, "message": "download done", "track": downloads };

    } catch (err) {
        return { "status": 0, "message": "Error occured while downloading ", "error": err };
    }
};

download_helper.update_downloads = async (id,no_downloads) => {
    try {
        var track = await Track.findOneAndUpdate({"_id": new ObjectId(id) },{"no_of_downloads":no_downloads})
        if (track ) {
            return { "status": 1, "message": "track downloaded", };
        } else {
            return { "status": 2, "message": "track not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding vote", "error": err }
    }
};

download_helper.get_all_track_by_id = async (artist_id) => {
    try {
        var aggregate = [{
            "$match": {
                "artist_id": new ObjectId(artist_id)
            }
        },
            {
                "$project":
                {
                    "_id" : 1,
                     "no_of_downloads" :1 
                }
            }
        ];
        var track = await Track.aggregate(aggregate);
        if (track && track.length > 0) {
            return { "status": 1, "message": "media found", "track": track };
        } else {
            return { "status": 2, "message": "No media available" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding media", "error": err }
    }
};

download_helper.get_all_track_by_track_id = async (track_id ) => {
    try {
        var like = await Track
            .findOne({ "_id": new ObjectId(track_id) })
        if (like) {
            return { "status": 1, "message": "Track details found", "track": like };
        } else {
            return { "status": 2, "message": "track not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding track", "error": err }
    }
};

download_helper.get_downloads_by_day = async (artist_id, day) => {
    var to = moment().utcOffset(0);
    var from = moment(to).subtract(day, "days").utcOffset(0);
    var aggregate = [
        {
            "$match":
                {
                    "created_at": { "$gt": new Date(from), "$lt": new Date(to) },
                    "artist_id": new ObjectId(artist_id)
                },
        },
        {
            "$group": {
                _id:  {$month: "$created_at"},
                count: { $sum: 1 },
            }
        },
    ];
    let result = await Download.aggregate(aggregate);
    if (result) {
        return { "status": 1, "message": "Vote  found", "results": result }
    } else {
        return { "status": 2, "message": "No  available Vote" }
    }

};

module.exports = download_helper;
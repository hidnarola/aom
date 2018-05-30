var Music = require("./../models/music_type");
var music_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


music_helper.get_all_music_type = async () => {
    try {
        var music = await Music
            .find()
        if (music) {
            return { "status": 1, "message": "music details found", "music": music };
        } else {
            return { "status": 2, "message": "music not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding artist", "error": err }
    }
};

module.exports = music_helper;
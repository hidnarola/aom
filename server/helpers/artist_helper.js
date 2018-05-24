var jwt = require('jsonwebtoken');

var Artist = require("./../models/artist");
var Track = require("./../models/track");
var artist_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

/*
 * insert_artist is used to insert into artist collection
 * 
 * @param   object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting artist, with error
 *          status  1 - If artist inserted, with inserted artist's document and appropriate message
 * 
 */
artist_helper.insert_artist = async (object) => {
    let art = new Artist(object)
    try {
        let data = await art.save();
        return { "status": 1, "message": "Record inserted", "artist": data };
    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting artist", "error": err };
    }
};


/*
 * get_artist_by_email is used to fetch single user by email address
 * 
 * @param   email   Specify email address of artist
 * 
 * @return  status  0 - If any error occur in finding artist, with error
 *          status  1 - If artist found, with found artist document
 *          status  2 - If artist not found, with appropriate error message
 * 
 */
artist_helper.get_artist_by_email = async (email_or_username) => {
    try {
        var artist = await Artist.findOne({ "$or": [{ "email": email_or_username }, { "email": email_or_username }] }).lean();
        if (artist) {
            return { "status": 1, "message": "artist details found", "artist": artist };
        } else {
            return { "status": 2, "message": "artist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding artist", "error": err }
    }
};

/*
 * get_artist_by_id is used to fetch artist details by artist id
 * 
 * @params  artist_id     _id field of artist collection
 * 
 * @return  status 0 - If any internal error occured while fetching artist data, with error
 *          status 1 - If artist data found, with artist object
 *          status 2 - If artist not found, with appropriate message
 */
artist_helper.get_artist_by_id = async (artist_id) => {
    try {
        var artist = await Artist.findOne({ "_id": { "$eq": artist_id } });
        if (artist) {
            return { "status": 1, "message": "Artist details found", "artist": artist };
        } else {
            return { "status": 2, "message": "Artist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding artist", "error": err }
    }
};



/*
 * update_artist_by_id is used to update artist data based on artist_id
 * 
 * @param   artist_id         String  _id of artist that need to be update
 * @param   object     JSON    object consist of all property that need to update
 * 
 * @return  status  0 - If any error occur in updating artist, with error
 *          status  1 - If artist updated successfully, with appropriate message
 *          status  2 - If artist not updated, with appropriate message
 * 
 */
artist_helper.update_artist_by_id = async (artist_id, artist_object) => {
    try {
        let artist = await Artist.findOneAndUpdate({ _id: artist_id }, artist_object);
        if (!artist) {
            return { "status": 2, "message": "Record has not updated" };
        } else {
            return { "status": 1, "message": "Record has been updated", "artist": artist };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while updating artist", "error": err }
    }
};

artist_helper.get_login_by_email = async (email) => {
    try {
        var artist = await Artist.findOne({ "email": email }).lean();
        if (artist) {
            return { "status": 1, "message": "artist details found", "artist": artist };
        } else {
            return { "status": 2, "message": "artist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding artist", "error": err }
    }
};


/*
 * get_all_artist is used to get all artist
 * 
 * @return  status 0 - If any internal error occured while fetching artist data, with error
 *          status 1 - If artist data found, with artist's documents
 *          status 2 - If artist not found, with appropriate message
 */
artist_helper.get_all_artist = async (filter, page_no, page_size) => {
    try {

        var artist = await Artist
            .find(filter)//"first_name":1,"last_name":1
            .skip((page_size * page_no) - page_size)
            .limit(page_size)
            .lean();

        if (artist && artist.length > 0) {
            return { "status": 1, "message": "artist details found", "artist": artist };
        } else {
            return { "status": 2, "message": "artist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding music", "error": err }
    }
};

artist_helper.get_artist_by_filter = async (filter, page_no, page_size) => {
    try {
        var artist = await Artist
            .find(filter)
            .skip((page_size * page_no) - page_size)
            .limit(page_size)
            .lean();

        if (artist && artist.length > 0) {
            return { "status": 1, "message": "artist details found", "artist": artist };
        } else {
            return { "status": 2, "message": "artist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding artist", "error": err }
    }
};

artist_helper.delete_artist_by_admin = async (artist_id) => {

    try {
        var artist = await Artist.findOneAndRemove({ "_id": (artist_id) })
        if (artist) {
            return { "status": 1, "message": "artist details found", "artist": artist };
        } else {
            return { "status": 2, "message": "artist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding artist", "error": err }
    }
};



artist_helper.update_artist_votes = async (artist_id, no_votes) => {

    try {
        var vote = await Artist.findOneAndUpdate({ "_id": new ObjectId(artist_id) }, { "no_of_votes": no_votes })

        if (vote) {
            return { "status": 1, "message": "voting updated", };
        } else {
            return { "status": 2, "message": "vote not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding vote", "error": err }
    }
};

artist_helper.get_all_track_of_artist = async () => {
    try {
        var artist = await Artist
            .find({}, {
                "first_name": 1,
                "last_name": 1,
                "gender": 1,
                "music_type": 1,
                "no_of_tracks": 1,
                "no_of_votes" : 1,
                "no_of_likes" : 1,
                "no_of_followers" : 1,
                "no_of_comments" : 1,
            })

        if (artist && artist.length > 0) {
            return { "status": 1, "message": "artist details found", "artist": artist };
        } else {
            return { "status": 2, "message": "artist not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding music", "error": err }
    }
};


module.exports = artist_helper;
var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');

var media_helper = require('../../helpers/media_helper');
var track_helper = require('../../helpers/track_helper');
var artist_helper = require('../../helpers/artist_helper');
var follower_helper = require('../../helpers/follower_helper');
var comment_helper = require('../../helpers/comment_helper');
var participate_helper = require('../../helpers/participate_helper');
var contest_helper = require('../../helpers/contest_helper');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');



/**
 * @api {get} /user/get_music_and_track music and track detail - Get 
 * @apiName music and track detail - Get
 * @apiGroup Artist
 *
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {Array} music and track detail as per id
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/get_music_and_track', async (req, res) => {
  artist_id=req.userInfo.id;
  var media = await media_helper.get_all_media_of_artist(artist_id);
  var track = await track_helper.get_all_track_of_artist(artist_id);

  if (media.status === 1 && track.status === 1 ) {
      logger.trace("got details successfully");
      res.status(config.OK_STATUS).json({ "status": 1, "media": media.media, "track": track.track});
  } else {
      logger.error("Error occured while fetching = ", media);
      res.status(config.INTERNAL_SERVER_ERROR).json(media);
  }
});


/**
 * @api {get} /artist/artist_by_id Artist detail - Get 
 * @apiName get_artist_by_id - Get
 * @apiGroup Artist
 *
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {Array} artist detail as per id
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/artist_by_id', async (req, res) => {
    artist_id=req.userInfo.id;
    var artist = await artist_helper.get_artist_by_id(artist_id);
    if (artist.status === 1) {
        logger.trace("got details successfully");
        res.status(config.OK_STATUS).json({ "status": 1, "artist": artist.artist});
    } else {
        logger.error("Error occured while fetching = ", artist);
        res.status(config.INTERNAL_SERVER_ERROR).json(artist);
    }
});



/**
 * @api {put} /artist Update artist profile
 * @apiName Update artist profile
 * @apiGroup Artist
 * 
 * @apiHeader {String}  Content-Type multipart/form-data
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} social_media Social Media
 * @apiParam {String} email Email of user
 * @apiParam {String} password User Password
 * @apiParam {String} first_name User First Name
 * @apiParam {String} last_name User Last Name
 * @apiParam {String} zipcode User Zipcode
 * @apiParam {String} music_type Music Type
 * @apiParam {String} image Image
 * 
 * @apiSuccess (Success 200) {JSON} user User details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.put('/', function (req, res) {
    user_id = req.userInfo.id;
    var obj = {
       
    };
    if (req.body.social_media ) {
        obj.social_media = req.body.social_media;
    }
    if (req.body.email ) {
        obj.email = req.body.email;
    }
    if (req.body.password ) {
        obj.password = req.body.password;
    }
    if (req.body.first_name ) {
        obj.first_name = req.body.first_name;
    }
    if (req.body.last_name ) {
        obj.last_name = req.body.last_name;
    }
    if (req.body.zipcode ) {
        obj.zipcode = req.body.zipcode;
    }
    if (req.body.music_type ) {
        obj.music_type = req.body.music_type;
    }
    async.waterfall([
        function (callback) {
            if (req.files && req.files['image']) {
                logger.trace("Uploading avatar image");
                var file = req.files['image'];
                var dir = "./uploads/artist";
                var mimetype = ['image/png', 'image/jpeg', 'image/jpg'];

                if (mimetype.indexOf(file.mimetype) !== -1) {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    //var extention = path.extname(file.name);
                    var extension = '.jpg';
                    var filename = "artist_" + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000) + extension;
                    file.mv(dir + '/' + filename, async (err) => {
                        if (err) {
                            logger.trace("There was an issue in uploading avatar image");
                            callback({ "status": config.MEDIA_ERROR_STATUS, "resp": { "status": 0, "message": "There was an issue in uploading avatar image" } });
                        } else {
                            logger.trace("Avatar image has uploaded for artist");

                            callback(null, filename);
                        }
                    });
                } else {
                    callback({ "status": config.MEDIA_ERROR_STATUS, "resp": { "status": 0, "message": "Invalid image format" } });
                }
            } else {
                callback(null, null);
            }
        }

    ], async (err, filename) => {
        if (err) {
            res.status(err.status).json(err.resp);
        } else {
            if (filename) {
                obj.image = await filename;
            }
        }
        var user_resp = await artist_helper.update_artist_by_id(req.userInfo.id, obj);
        if (user_resp.status === 0) {
            res.status(config.INTERNAL_SERVER_ERROR).json({ "error": user_resp.error });
        } else {
            res.status(config.OK_STATUS).json({ "message": "Profile has been updated successfully" });
        }
    });
});



router.post('/', async (req, res) => {
    var resp_gender = await follower_helper.get_artist_followers_by_gender(req.userInfo.id,req.body.day);
    var resp_day = await follower_helper.get_artist_followers_by_day(req.userInfo.id,req.body.day);
    var resp_age = await follower_helper.get_artist_followers_by_age(req.userInfo.id,req.body.day);
    if (resp_gender.status === 0 && resp_day.status === 0 && resp_age.status === 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while finding artist", "error": resp_gender.error ,"error":resp_day.error });
    } else if (resp_gender.status === 2) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Not available" });
    } else {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Followers found", "gender": resp_gender.results,"day" : resp_day.results, "age" : resp_age.results });
    }
});



router.get('/track_likes', async (req, res) => {
    artist_id=req.userInfo.id;
  
    var track = await track_helper.get_all_track_by_id(artist_id);
  
    if ( track.status === 1 ) {
        logger.trace("got details successfully");
        res.status(config.OK_STATUS).json({ "status": 1, "track": track.track});
    } else {
        logger.error("Error occured while fetching = ", track);
        res.status(config.INTERNAL_SERVER_ERROR).json(track);
    }
});



router.get('/track_comment', async (req, res) => {
    artist_id=req.userInfo.id;
    var comment = await comment_helper.get_all_comment_by_track(artist_id);
    if ( comment.status === 1 ) {
        logger.trace("got details successfully");
        res.status(config.OK_STATUS).json({ "status": 1, "comment": comment.comment});
    } else {
        logger.error("Error occured while fetching = ", track);
        res.status(config.INTERNAL_SERVER_ERROR).json(track);
    }
});

router.post("/participate", async (req, res) => {
    var schema = {
   
      "contest_id": {
        notEmpty: true,
        errorMessage: "Music Type is required"
      },
      
    };
  
    req.checkBody(schema);
    var errors = req.validationErrors();
    if (!errors) {
   
    var obj = {
      artist_id :req.userInfo.id,
      contest_id : req.body.contest_id
    };
   
   var resp_data = await participate_helper.get_participant(obj.artist_id, obj.contest_id); 
   if (resp_data && resp_data.participate == 0) {

    var resp_data = await participate_helper.insert_participant(obj);
    if (resp_data.status == 0) {
      logger.error("Error occured while inserting = ", resp_data);
      res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
     } else

     var resp_data = await contest_helper.get_contest_by_id(obj.contest_id);
     no_paritipant = resp_data.contest.no_of_participants + 1
     var resp_data = await contest_helper.update_participant(obj.contest_id, no_paritipant);
     logger.trace(" got successfully = ", resp_data);
     res.status(config.OK_STATUS).json(resp_data);
   }
   else {
     logger.trace("Already participated for this contest");
     res.status(config.OK_STATUS).json({ "message": "Already participated for this contest" });
   }
 } 
   else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
   }
});


module.exports = router;
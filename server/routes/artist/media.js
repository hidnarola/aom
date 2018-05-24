var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');
var media_helper = require('../../helpers/media_helper');


var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');


/**
 * @api {post} /artist/media   Media Add
 * @apiName  Media - Add
 * @apiGroup Artist

 * @apiHeader {String}  Content-Type multipart/form-data
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} artist_id Artist id of artist
 * @apiParam {String} link link of video
 * @apiParam {String} image Image 
 *
 * @apiSuccess (Success 200) {JSON} purchase details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post("/", async (req, res) => {
    var obj = {   
     artist_id : req.userInfo.id
    };
    if (req.body.link && req.body.link != null) {
        obj.link = req.body.link;
    }
   
    async.waterfall([
        function (callback) {
            if (req.files && req.files['image']) {
                logger.trace("Uploading avatar image");
                var file = req.files['image'];
                var dir = "./uploads/track";
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
                            logger.trace("Avatar image has uploaded for user");

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
        var resp = await media_helper.insert_media(obj);
        if (resp.status === 0) {
            res.status(config.INTERNAL_SERVER_ERROR).json({ "error": resp.error });
        } else {
            res.status(config.OK_STATUS).json({ "message": "Inserted successfully" });
        }
    });

});


/**
 * @api {get} /artist/media   Track detail - Get 
 * @apiName get_all_media_of_artist - Get
 * @apiGroup Artist
 *
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {Array} Media detail as per id
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get("/", async (req, res) => {
    artist_id = req.userInfo.id;
    logger.trace("Get all Artist API called");
    var resp_data = await media_helper.get_all_media_of_artist(artist_id);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching Artist = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("Artist got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
});



module.exports = router;
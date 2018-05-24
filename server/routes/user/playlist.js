var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');


var playlist_helper = require('../../helpers/playlist_helper');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');


/**
 * @api {post} /user/playlist Playlist  Add
 * @apiName Playlist - Add
 * @apiGroup User

 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} name  name of playlist
 * @apiParam {String} audio Audio
 * @apiParam {String} description description of playlist
 *
 * @apiSuccess (Success 200) {JSON} playlist details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */



router.post('/', function (req, res) {
  var schema = {
    "name": {
      notEmpty: true,
      errorMessage: "Artist Id is required"
    },
    
  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
  var obj = {
      user_id: req.userInfo.id,
      name: req.body.name,
     
    };
   if(req.body.description && req.body.description!=null)
   {
     obj.description = req.body.description
   }
		async.waterfall(
      [
        function(callback) {
          //image upload
          if (req.files && req.files["audio"]) {
            var file_path_array = [];
            // var files = req.files['images'];
            var files = [].concat(req.files.audio);
            var dir = "./uploads/track";
             var mimetype = ['audio/aac', 'audio/mp3', 'audio/mpeg'];

            // assuming openFiles is an array of file names
            async.eachSeries(
              files,
              function(file, loop_callback) {
								var mimetype = ['audio/aac', 'audio/mp3', 'audio/mpeg'];
                if (mimetype.indexOf(file.mimetype) != -1) {
                  if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                  }
                  extention = ".mp4";
                  filename = "audio_" + new Date().getTime() + extention;
                  file.mv(dir + "/" + filename, function(err) {
                    if (err) {
                      logger.error("There was an issue in uploading audio");
                      loop_callback({
                        status: config.MEDIA_ERROR_STATUS,
                        err: "There was an issue in uploading audio"
                      });
                    } else {
                      logger.trace(
                        "image has been uploaded. Image name = ",
                        filename
                      );
                      location =  filename;
                      file_path_array.push(location);
                      loop_callback();
                    }
                  });
                } else {
                  logger.error(" format is invalid");
                  loop_callback({
                    status: config.VALIDATION_FAILURE_STATUS,
                    err: " format is invalid"
                  });
                }
              },
              function(err) {
                // if any of the file processing produced an error, err would equal that error
                if (err) {
                  res.status(err.status).json(err);
                } else {
                  callback(null, file_path_array);
                }
              }
            );
          } else {
            logger.info(
              "Image not available to upload. Executing next instruction"
            );
            callback(null, []);
          }
        }
      ],
      async (err, file_path_array) => {
        //End image upload
        obj.audio = file_path_array;
        let data = await playlist_helper.insert_playlist(obj);
        if (data.status === 0) {
          logger.error("Error while inserting exercise data = ", data);
          return res.status(config.BAD_REQUEST).json({ data });
        } else {
          return res.status(config.OK_STATUS).json(data);
        }
      }
    ); 
  }
});

/**
 * @api {get} /user/playlist  Playlist - Get by id
 * @apiName Playlist - Get by id
  * @apiGroup User
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {Array} playlist  of playlist document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get("/", async (req, res) => {
  user_id = req.userInfo.id;
  var resp_data = await playlist_helper.get_playlist_by_user_id(user_id);
  if (resp_data.status == 0) {
      logger.error("Error occured while fetching Track = ", resp_data);
      res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
  } else {
      logger.trace("Artist got successfully = ", resp_data);
      res.status(config.OK_STATUS).json(resp_data);
  }
});


/**
 * @api {put} /user/playlist/:playlist_id Update playlist 
 * @apiName Update playlist 
 * @apiGroup User
 * 
 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} name Playlist Name of playlist
 * @apiParam {String} description Description of playlist
 * @apiParam {String} audio Audio

 * 
 * @apiSuccess (Success 200) {JSON} user User details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.put('/:playlist_id', function (req, res) {
  user_id = req.userInfo.id;
  playlist_id = req.params.playlist_id;
  var schema = {
   
  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
  var obj = {
      user_id: req.userInfo.id,
      
    };
    if (req.body.name && req.body.name != null) {
      obj.name = req.body.name;
   }
    if (req.body.description && req.body.description != null) {
      obj.description = req.body.description;
   }
		async.waterfall(
      [
        function(callback) {
          //image upload
          if (req.files && req.files["audio"]) {
            var file_path_array = [];
            // var files = req.files['images'];
            var files = [].concat(req.files.audio);
            var dir = "./uploads/playlist";
             var mimetype = ['audio/aac', 'audio/mp3', 'audio/mpeg'];

            // assuming openFiles is an array of file names
            async.eachSeries(
              files,
              function(file, loop_callback) {
								var mimetype = ['audio/aac', 'audio/mp3', 'audio/mpeg'];
                if (mimetype.indexOf(file.mimetype) != -1) {
                  if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                  }
                  extention = ".mp4";
                  filename = "audio_" + new Date().getTime() + extention;
                  file.mv(dir + "/" + filename, function(err) {
                    if (err) {
                      logger.error("There was an issue in uploading audio");
                      loop_callback({
                        status: config.MEDIA_ERROR_STATUS,
                        err: "There was an issue in uploading audio"
                      });
                    } else {
                      logger.trace(
                        "image has been uploaded. Image name = ",
                        filename
                      );
                      location =  filename;
                      file_path_array.push(location);
                      loop_callback();
                    }
                  });
                } else {
                  logger.error(" format is invalid");
                  loop_callback({
                    status: config.VALIDATION_FAILURE_STATUS,
                    err: " format is invalid"
                  });
                }
              },
              function(err) {
                // if any of the file processing produced an error, err would equal that error
                if (err) {
                  res.status(err.status).json(err);
                } else {
                  callback(null, file_path_array);
                }
              }
            );
          } else {
            logger.info(
              "Image not available to upload. Executing next instruction"
            );
            callback(null, []);
          }
        }
      ],
      async (err, file_path_array) => {
        //End image upload
        obj.audio = file_path_array;
        let data = await playlist_helper.update_playlist(user_id,playlist_id,obj);
        if (data.status === 0) {
          return res.status(config.BAD_REQUEST).json({ data });
        } else {
          return res.status(config.OK_STATUS).json(data);
        }
      }
    ); 
  
 }

});


/**
 * @api {delete} /user/playlist/:playlist_id Delete Playlist  
 * @apiName delete_playlist 
 * @apiGroup User
 *
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {String} success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.delete('/:playlist_id', async (req, res) => {
  user_id = req.userInfo.id;
  playlist_id = req.params.playlist_id;
  var del_resp = await playlist_helper.delete_playlist(user_id, playlist_id);
  if (del_resp.status === 0) {
    res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while deleting playlist", "error": del_resp.error });
  } else if (del_resp.status === 2) {
    res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Can't remove playlist" });
  } else {
    res.status(config.OK_STATUS).json({ "status": 1, "message": "playlist has been removed" });
  }
});

module.exports = router;


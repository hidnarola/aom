var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


var track_helper = require('../../helpers/track_helper');

var fs = require('fs');


/**
 * @api {post} /admin/track/list_tracks Get all Tracks
 * @apiName Get all Tracks
 * @apiGroup Admin
 * @apiParam {Number} page_no Page Number
 * @apiParam {Number} page_size Page Size
 * @apiParam {String} gender Gender for filter
 * @apiParam {String} first_name First Name for filter
 * @apiParam {String} last_name Last Name for filter
 * @apiSuccess (Success 200) {Array} users Array of users document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post("/list_tracks", async (req, res) => {




  var filter = {};
  var page_no = {};
  var page_size = {};

  var schema = {
    "page_no": {
      notEmpty: true,
      errorMessage: "page_no is required"
    },
    "page_size": {
      notEmpty: true,
      errorMessage: "page_size is required"
    }
  };


  if (req.body.artist_id) {
    filter.artist_id = new ObjectId(req.body.artist_id);
  }
  if (req.body.name) {
    filter.name = req.body.name;
  }
  if (req.body.music_type) {
    filter.music_type = req.body.music_type;
  }
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
    var resp_data = await track_helper.get_track_by_filter(filter, req.body.page_no, req.body.page_size);
    if (resp_data.status == 0) {
      logger.error("Error occured while fetching users = ", resp_data);
      res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
      logger.trace("music got successfully = ", resp_data);
      res.status(config.OK_STATUS).json(resp_data);
    }
  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }




});




/**
 * @api {delete} /admin/track/:user_id Delete Track  
 * @apiName Delete Track  
 * @apiGroup Admin
 *
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {String} success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.delete('/:track_id', async (req, res) => {

  track_id = req.params.track_id;
  var del_resp = await track_helper.delete_track_by_admin(track_id);
  if (del_resp.status === 0) {
    res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while deleting track", "error": del_resp.error });
  } else if (del_resp.status === 2) {
    res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Can't delete track" });
  } else {
    res.status(config.OK_STATUS).json({ "status": 1, "message": "track has been deleted" });
  }
});




module.exports = router;
var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var artist_helper = require('../../helpers/artist_helper');

var fs = require('fs');



/**
 * @api {post} /admin/artist/list_artist Get all Artist
 * @apiName Get all Artist
 * @apiGroup Admin
 * @apiParam {Number} page_no Page Number
 * @apiParam {Number} page_size Page Size
 * @apiParam {String} gender Gender for filter
 * @apiParam {String} first_name First Name for filter
 * @apiParam {String} last_name Last Name for filter
 * @apiParam {String} music_type Music Type for filter
 * @apiSuccess (Success 200) {Array} users Array of users document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post("/list_artist", async (req, res) => {

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

  if (req.body.gender) {
    filter.gender = req.body.gender;
  }
  if (req.body.first_name) {
    filter.first_name = req.body.first_name;
  }
  if (req.body.last_name) {
    filter.last_name = req.body.last_name;
  }
  if (req.body.music_type) {
    filter.music_type = new ObjectId(req.body.music_type);
  }
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
    var resp_data = await artist_helper.get_artist_by_filter(filter, req.body.page_no, req.body.page_size);
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
 * @api {delete} /admin/artist/:artist_id Delete Artist  
 * @apiName delete_playlist 
 * @apiGroup Admin
 *
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {String} success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.delete('/:artist_id', async (req, res) => {
  artist_id = req.params.artist_id;
  var del_resp = await artist_helper.delete_artist_by_admin(artist_id);
  if (del_resp.status === 0) {
    res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while deleting artist", "error": del_resp.error });
  } else if (del_resp.status === 2) {
    res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Can't delete artist" });
  } else {
    res.status(config.OK_STATUS).json({ "status": 1, "message": "artist has been deleted" });
  }
});





module.exports = router;
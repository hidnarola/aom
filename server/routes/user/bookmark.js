var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');

var bookmark_helper = require('../../helpers/bookmark_helper');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');



/**
 * @api {post} /user/bookmark Bookmark on Artist Add
 * @apiName Bookmark on Artist - Add
 * @apiGroup User

 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} artist_id Artist id of user
 *
 * @apiSuccess (Success 200) {JSON} bookmark details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/', async (req, res) => {

  logger.trace("API - Promoter signup called");
  logger.debug("req.body = ", req.body);
  var schema = {

    "artist_id": {
      notEmpty: true,
      errorMessage: "Artist Id is required"
    },


  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    var obj = {
      user_id: req.userInfo.id,
      artist_id: req.body.artist_id

    };
    var resp_data = await bookmark_helper.insert_book_mark_artist(obj);
    if (resp_data.status == 0) {
      logger.error("Error occured while fetching music = ", resp_data);
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
 * @api {get} /user/bookmark Bookmark detail - Get 
 * @apiName get_all_bookmarked_artist - Get
 * @apiGroup User
 *
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {Array} bookmark detail as per id
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get("/", async (req, res) => {
  user_id = req.userInfo.id;
  logger.trace("Get all Artist API called");
  var resp_data = await bookmark_helper.get_all_bookmarked_artist(user_id);
  if (resp_data.status == 0) {
    logger.error("Error occured while fetching Artist = ", resp_data);
    res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
  } else {
    logger.trace("Artist got successfully = ", resp_data);
    res.status(config.OK_STATUS).json(resp_data);
  }
});




/**
 * @api {delete} /user/bookmark/:bookmark_id Delete Bookmark  
 * @apiName delete_bookmark 
 * @apiGroup User
 *
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {String} success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.delete('/:bookmark_id', async (req, res) => {
  user_id = req.userInfo.id;
  var del_resp = await bookmark_helper.delete_bookmark(user_id, req.params.bookmark_id);
  if (del_resp.status === 0) {
    res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while deleting bookmark", "error": del_resp.error });
  } else if (del_resp.status === 2) {
    res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Can't remove bookmark" });
  } else {
    res.status(config.OK_STATUS).json({ "status": 1, "message": "bookmark has been removed" });
  }
});

module.exports = router;
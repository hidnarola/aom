var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');

var follower_helper = require('../../helpers/follower_helper');
var vote_track_helper = require('../../helpers/vote_track_helper');
var track_helper = require('../../helpers/track_helper');
var artist_helper = require('../../helpers/artist_helper');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');



/**
 * @api {post} /user/follow Follow Artist Add
 * @apiName Follow Artist - Add
 * @apiGroup User

 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} artist_id Artist id of artist
 *
 * @apiSuccess (Success 200) {JSON} follow details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/follow', async (req, res) => {
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
    var resp_data = await follower_helper.follow_artist(obj);
    if (resp_data.status == 0) {
      logger.error("Error occured while following = ", resp_data);
      res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
      var resp = await artist_helper.get_artist_by_id(obj.artist_id);
      no_follow = resp.artist.no_of_followers + 1
     var resp_data = await track_helper.update_artist_for_followers(obj.artist_id, no_follow);
      logger.trace("music got successfully = ", resp_data);
      logger.trace("followed successfully = ", resp_data);
      res.status(config.OK_STATUS).json(resp_data);
    }
  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});



router.post('/vote_track', async (req, res) => {
  user_id = req.userInfo.id;

  var schema = {
    "track_id": {
      notEmpty: true,
      errorMessage: "Track Id is required"
    },
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
      track_id: req.body.track_id,
      artist_id: req.body.artist_id,

    };
    var resp_data = await vote_track_helper.get_all_voted_artist(user_id, obj.track_id);
    if (resp_data && resp_data.vote == 0) {

      var data = await vote_track_helper.vote_for_track(user_id, obj);

      if (data && data.status == 0) {
        logger.error("Error occured while voting = ", data);
        res.status(config.INTERNAL_SERVER_ERROR).json(data);
      } else

      var resp_data = await track_helper.get_all_track_by_track_id(obj.track_id);
      no_vote = resp_data.track[0].no_of_votes + 1;
      var resp_data = await track_helper.update_votes(obj.track_id, no_vote);

      var resp_data1 = await artist_helper.get_artist_by_id(obj.artist_id);
    
      no_vote1 = resp_data1.artist.no_of_votes + 1;
      var resp_datas  = await artist_helper.update_artist_votes(obj.artist_id, no_vote1);
     

      logger.trace("voting done successfully = ", data);
      res.status(config.OK_STATUS).json(data);
    }
    else {
      logger.trace("Already Voted");
      res.status(config.OK_STATUS).json({ "message": "Already Voted" });
    }
  }
  else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});







module.exports = router;
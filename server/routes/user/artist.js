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
var user_helper = require('../../helpers/user_helper');
var mail_helper = require('../../helpers/mail_helper');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');



/**
 * @api {post} /user/artist/follow Follow Artist Add
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

      var response = await user_helper.get_user_by_id(obj.user_id);
      console.log('response', response);

      no_follow = response.user.no_of_followers + 1
      var resp_data = await user_helper.update_user_for_followers(obj.user_id, no_follow);


      console.log("sending mail");

      let mail_resp = await mail_helper.send("listener_followed", {
        "to": resp.artist.email,
        "subject": "Music Social Voting - Email confirmation"
      })
      // }, {
      //     "confirm_url": config.website_url + "/email_confirm/" + data.artist._id
      //   });

      logger.trace("followed successfully = ", resp_data);
      res.status(config.OK_STATUS).json(resp_data);
    }
  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});

module.exports = router;
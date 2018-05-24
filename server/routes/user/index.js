var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');

var user_helper = require('../../helpers/user_helper');
var participate_helper = require('../../helpers/participate_helper');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');

/**
 * @api {put} /user Update user profile
 * @apiName Update user profile
 * @apiGroup User
 * 
 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} social_media Social Media
 * @apiParam {String} email Email of user
 * @apiParam {String} password User Password
 * @apiParam {String} first_name User First Name
 * @apiParam {String} last_name User Last Name
 * @apiParam {String} zipcode User Zipcode
 * @apiParam {String} music_type Music Type
 * 
 * @apiSuccess (Success 200) {JSON} user User details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.put("/", async (req, res) => {
    user_id = req.userInfo.id;
    var obj = {

    };
    if (req.body.social_media && req.body.social_media != null) {
      obj.social_media = req.body.social_media;
  }
    if (req.body.email && req.body.email != null) {
      obj.email = req.body.email;
  }
  if (req.body.password  && req.body.password != null) {
      obj.password = req.body.password;
  }
  if (req.body.first_name  && req.body.first_name != null) {
      obj.first_name = req.body.first_name;
  }
  if (req.body.last_name  && req.body.last_name != null) {
      obj.last_name = req.body.last_name;
  }
  if (req.body.zipcode  && req.body.zipcode != null) {
      obj.zipcode = req.body.zipcode;
  }
  if (req.body.music_type  && req.body.music_type != null) {
      obj.music_type = req.body.music_type;
  }
    var resp_data = await user_helper.update_user_by_id(user_id,obj);
    if (resp_data.status == 0) {
      logger.error("Error occured while updating = ", resp_data);
      res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
      logger.trace("Updated successfully = ", resp_data);
      res.status(config.OK_STATUS).json(resp_data);
    }
});



module.exports = router;
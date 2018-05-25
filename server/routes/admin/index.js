var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var user_helper = require('../../helpers/user_helper');
var artist_helper = require('../../helpers/artist_helper');
var admin_helper = require('../../helpers/admin_helper');

var fs = require('fs');



/**
 * @api {put} /admin Update admin profile
 * @apiName Update admin profile
 * @apiGroup User
 * 
 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} name Name of admin
 * @apiParam {String} password Admin Password
 * @apiSuccess (Success 200) {JSON} admin Admin details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.put("/", async (req, res) => {
  user_id = req.userInfo.id;
  var obj = {

  };
  if (req.body.name && req.body.name != null) {
    obj.name = req.body.name;
  }
  if (req.body.password && req.body.password != null) {
    obj.password = req.body.password;
  }
  var resp_data = await admin_helper.update_admin_by_id(user_id, obj);
  if (resp_data.status == 0) {
    logger.error("Error occured while updating = ", resp_data);
    res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
  } else {
    logger.trace("Updated successfully = ", resp_data);
    res.status(config.OK_STATUS).json(resp_data);
  }
});

module.exports = router;
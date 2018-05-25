var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');
var admin_helper = require('../../helpers/admin_helper');
var permission_helper = require('../../helpers/permission_helper');
var contest_helper = require('../../helpers/contest_helper');
var participate_helper = require('../../helpers/participate_helper');
var artist_helper = require('../../helpers/artist_helper');
var user_helper = require('../../helpers/user_helper');
var track_helper = require('../../helpers/track_helper');


var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var fs = require('fs');


/**
 * @api {post} /super_admin/add_admin Add Admin
 * @apiName Add Admin
 * @apiGroup Super Admin

 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} name Admin Name
 * @apiParam {String} email Admin Email
 * @apiParam {String} password Admin password
 * @apiParam {String} permission Permission to Admin
 *
 * @apiSuccess (Success 200) {JSON} admin details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post("/add_admin", async (req, res) => {
  var schema = {
    "name": {
      notEmpty: true,
      errorMessage: "name is required"
    },
    "email": {
      notEmpty: true,
      errorMessage: "email is required"
    },
    "password": {
      notEmpty: true,
      errorMessage: "password is required"
    },
    "permission": {
      notEmpty: true,
      errorMessage: "permission is required"
    }
  };

  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    var obj = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      permission: req.body.permission
    };
    var resp_data = await admin_helper.insert_admin(obj);
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
 * @api {post} /super_admin/add_permission Add Permission
 * @apiName Add Permission
 * @apiGroup Super Admin

 * @apiHeader {String}  Content-Type application/json
 * @apiHeader {String}  x-access-token  unique access-key
 * 
 * @apiParam {String} name Permission Name
 
 * @apiSuccess (Success 200) {JSON} admin details
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post("/add_permission", async (req, res) => {
  var schema = {
    "name": {
      notEmpty: true,
      errorMessage: "name is required"
    },

  };

  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    var obj = {
      name: req.body.name
    };
    var resp_data = await permission_helper.insert_permission(obj);
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


// add contest
router.post("/add_contest", async (req, res) => {
  var schema = {
    "name": {
      notEmpty: true,
      errorMessage: "name is required"
    },
    "start_date": {
      notEmpty: true,
      errorMessage: "Start Date is required"
    },
    "end_date": {
      notEmpty: true,
      errorMessage: "End Date is required"
    },
    "music_type": {
      notEmpty: true,
      errorMessage: "Music Type is required"
    },
    "location": {
      notEmpty: true,
      errorMessage: "Location is required"
    },

  };

  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    var obj = {
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      music_type: req.body.music_type,
      location: req.body.location
    };
    var resp_data = await contest_helper.insert_contest(obj);
    if (resp_data.status == 0) {
      logger.error("Error occured while inserting = ", resp_data);
      res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
      logger.trace(" got successfully = ", resp_data);
      res.status(config.OK_STATUS).json(resp_data);
    }
  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});


//get all participant
router.get('/contest', async (req, res) => {
  var contest = await contest_helper.get_all_contest_and_participant();
  if (contest.status === 1) {
    logger.trace("got details successfully");
    res.status(config.OK_STATUS).json({ "status": 1, "contest": contest.participate });
  } else {
    logger.error("Error occured while fetching = ", contest);
    res.status(config.INTERNAL_SERVER_ERROR).json(contest);
  }
});


/**
 * @api {delete} /super_admin/:artist_id Delete Artist  
 * @apiName Delete Artist  
 * @apiGroup Super Admin
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


/**
 * @api {post} /super_admin/list_users Get all Users
 * @apiName Get all Users
 * @apiGroup Super Admin
 * @apiParam {Number} page_no Page Number
 * @apiParam {Number} page_size Page Size
 * @apiParam {String} gender Gender for filter
 * @apiParam {String} first_name First Name for filter
 * @apiParam {String} last_name Last Name for filter
 * @apiSuccess (Success 200) {Array} users Array of users document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post("/list_users", async (req, res) => {

  var filter = {};
  var page_no = {};
  var page_size = {};

  var schema = {
  /*  "page_no": {
      notEmpty: true,
      errorMessage: "page_no is required"
    },
    "page_size": {
      notEmpty: true,
      errorMessage: "page_size is required"
    }*/
  };

  /*if (req.body.gender) {
    filter.gender = req.body.gender;
  }
  if (req.body.first_name) {
    filter.first_name = req.body.first_name;
  }
  if (req.body.last_name) {
    filter.last_name = req.body.last_name;
  }*/
  if (typeof req.body.filter != "undefined") {
    filter["first_name"] = req.body.filter;
  }
  if (typeof req.body.filter != "undefined") {
    filter["last_name"] = req.body.filter;
  }
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
    var resp_data = await user_helper.get_users_by_filter(filter, req.body.page_no, req.body.page_size);
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
 * @api {delete} /super_admin/:user_id Delete User  
 * @apiName Delete User  
 * @apiGroup Super Admin
 *
 * @apiHeader {String}  x-access-token unique access-key
 *
 * @apiSuccess (Success 200) {String} success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.delete('/:user_id', async (req, res) => {
  user_id = req.params.user_id;
  var del_resp = await user_helper.delete_user_by_admin(user_id);
  if (del_resp.status === 0) {
    res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while deleting user", "error": del_resp.error });
  } else if (del_resp.status === 2) {
    res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Can't delete user" });
  } else {
    res.status(config.OK_STATUS).json({ "status": 1, "message": "user has been deleted" });
  }
});

router.post("/home", async (req, res) => {

  var resp_data = await artist_helper.get_all_track_of_artist();
  var resp = await track_helper.get_artist_by_day_vote(req.body.day);
  var resp_like = await track_helper.get_artist_by_day_like(req.body.day);
  var resp_comment = await track_helper.get_artist_by_day_comment(req.body.day);

  if (resp_data.status == 0 && resp.status == 0 && resp_like.status == 0) {
    logger.error("Error occured while fetching artist = ", resp_data);
    res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
  } else {
    logger.trace("artist got successfully = ", { "artist": resp_data, "day_vote": resp, "like": resp_like });
    res.status(config.OK_STATUS).json({ "artist": resp_data, "day_vote": resp.results, "like": resp_like.results, "comment": resp_comment.results });

  }
});

router.post("/get_artist", async (req, res) => {

  var filter = {};
  

 if (req.body.location) {
    filter.location = req.body.location;
  }

  if (req.body.music_type) {
    filter.music_type = new ObjectId(req.body.music_type);
  }

 

  if (req.body.search) {
    var r = new RegExp(req.body.search);
    var search = { "$regex": r, "$options": "i" };
    filter.first_name = search;
  }
 
    var resp_data = await artist_helper.get_all_active_and_suspend_artist(filter);
    if (resp_data.status == 0) {
      logger.error("Error occured while fetching artist = ", resp_data);
      res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
      logger.trace("artist got successfully = ", { "artist": resp_data });
      res.status(config.OK_STATUS).json({ "artist": resp_data });

    }
  
});



router.post("/suspend/artist/:artist_id", async (req, res) => {

  var resp = await artist_helper.get_artist_by_id(req.params.artist_id);

  if (resp.status == 0) {
    logger.error("Error occured while fetching artist = ", resp);
    res.status(config.INTERNAL_SERVER_ERROR).json(resp);
  } else {
    if (resp.artist.status == "Active") {
      var stat = "Suspended"
      var artist_resp = await artist_helper.update_artist_status(req.params.artist_id, stat);
    }
    else {
      var stat = "Active"
      var artist_resp = await artist_helper.update_artist_status(req.params.artist_id, stat);
    }
    logger.trace("artist updated successfully = ", { "artist": artist_resp });
    res.status(config.OK_STATUS).json({ "artist": artist_resp });

  }




});

router.post("/suspend/user/:user_id", async (req, res) => {

  var resp = await user_helper.get_user_by_id(req.params.user_id);

  if (resp.status == 0) {
    logger.error("Error occured while fetching artist = ", resp);
    res.status(config.INTERNAL_SERVER_ERROR).json(resp);
  } else {
    if (resp.user.status == "Active") {
      var stat = "Suspended"
      var user_resp = await user_helper.update_user_status(req.params.user_id, stat);
    }
    else {
      var stat = "Active"
      var user_resp = await user_helper.update_user_status(req.params.user_id, stat);
    }
    logger.trace("user updated successfully = ", { "user": user_resp });
    res.status(config.OK_STATUS).json({ "artist": user_resp });
  }
});



router.post("/get_user", async (req, res) => {

  var filter = {};  
 if (req.body.location) {
    filter.location = req.body.location;
  }

  if (req.body.music_type) {
    filter.music_type = new ObjectId(req.body.music_type);
  } 

  if (req.body.search) {
    var r = new RegExp(req.body.search);
    var search = { "$regex": r, "$options": "i" };
    filter.first_name = search;
  }
 
    var resp_data = await user_helper.get_all_active_and_suspend_user(filter);
    if (resp_data.status == 0) {
      logger.error("Error occured while fetching artist = ", resp_data);
      res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
      logger.trace("artist got successfully = ", { "artist": resp_data });
      res.status(config.OK_STATUS).json({ "artist": resp_data });

    }
  
});
module.exports = router;
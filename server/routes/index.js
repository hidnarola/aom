var express = require('express');
var router = express.Router();
var config = require('../config');
var fs = require('fs');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var logger = config.logger;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var async = require('async');
var mail_helper = require('./../helpers/mail_helper');

var artist_helper = require('./../helpers/artist_helper');
var user_helper = require('./../helpers/user_helper');
var track_helper = require('./../helpers/track_helper');
var admin_helper = require('./../helpers/admin_helper');
var super_admin_helper = require('./../helpers/super_admin_helper');
var music_helper = require('./../helpers/music_helper');

/**
 * @api {post} /artist_registration Artist Registration
 * @apiName Artist Registration
 * @apiGroup Root
 * 
 * @apiDescription  Registration request for Artist role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 
 * @apiParam {Array} music_type Type of music
 * @apiParam {String} email Email address
 * @apiParam {String}  password Password
 * @apiParam {String} last_name Last Name
 * @apiParam {String} first_name First Name
 * @apiParam {String} zipcode Zipcode
 * @apiParam {String} gender Gender


 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/artist_registration', async (req, res) => {
  var schema = {
    "music_type": {
      notEmpty: true,
      errorMessage: "Music Type is required"
    },
    "email": {
      notEmpty: true,
      errorMessage: "Email is required"
    },
    "password": {
      notEmpty: true,
      errorMessage: "password is required"
    },
    "last_name": {
      notEmpty: true,
      errorMessage: "last name is required"
    },
    "first_name": {
      notEmpty: true,
      errorMessage: "first name is required"
    },
    "zipcode": {
      notEmpty: true,
      errorMessage: "zipcode is required"
    },
    "gender": {
      notEmpty: true,
      errorMessage: "Gender is required"
    }

  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
    var reg_obj = {

      "email": req.body.email,
      "gender": req.body.gender,
      "password": req.body.password,
      "first_name": req.body.first_name,
      "last_name": req.body.last_name,
      "zipcode": req.body.zipcode,
      "music_type": req.body.music_type
    };

    async.waterfall(
      [
        function (callback) {
          //image upload
          if (req.files && req.files["image"]) {
            var file_path_array = [];
            // var files = req.files['images'];
            var file = req.files.image;
            var dir = "./uploads/artist";
            var mimetype = ["image/png", "image/jpeg", "image/jpg"];

            // assuming openFiles is an array of file names

            if (mimetype.indexOf(file.mimetype) != -1) {
              logger.trace("Uploading image");
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
              }

              extension = ".jpg";
              filename = "image_" + new Date().getTime() + extension;
              file.mv(dir + '/' + filename, function (err) {
                if (err) {
                  logger.trace("Problem in uploading image");
                  callback({ "status": config.MEDIA_ERROR_STATUS, "err": "There was an issue in uploading image" });
                } else {
                  logger.trace("Image uploaded");
                  callback(null, filename);
                }
              });
            } else {
              logger.trace("Invalid image format");
              callback({ "status": config.VALIDATION_FAILURE_STATUS, "err": "Image format is invalid" });
            }
          } else {
            logger.trace("Avatar is not available");
            callback(null, null);
          }
        }
      ],
      async (err, filename) => {
        //End image upload

        if (filename) {
          reg_obj.image = filename;
        }

        let artist = await artist_helper.get_artist_by_email(req.body.email)
        if (artist.status === 2) {

          var obj = {}
          var data = await artist_helper.insert_artist(reg_obj);
          var datas = await artist_helper.insert_notification(obj);

          if (data.status == 0) {
            logger.debug("Error = ", data.error);
            res.status(config.INTERNAL_SERVER_ERROR).json(data);
          } else {
            logger.trace("Artist has been inserted");

            logger.trace("sending mail");

            let mail_resp = await mail_helper.send("email_confirmation", {
              "to": data.artist.email,
              "subject": "Music Social Voting - Email confirmation"
            }, {
                "confirm_url": config.website_url + "/email_confirm/" + data.artist._id
              });
            if (mail_resp.status === 0) {
              res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
            } else {
              res.status(config.OK_STATUS).json({ "status": 1, "message": "Artist registered successfully" });
            }
          }
        } else {
          res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Artist's email already exist" });
        }
      }
    );
  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});

/**
 * @api {get} /artist_email_verify/:artist_id Artist email verification
 * @apiName Artist email verification
 * @apiGroup Root
 * 
 * @apiDescription  Email verification request for artist
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/artist_email_verify/:artist_id', async (req, res) => {

  logger.debug("req.body = ", req.body);

  var artist_resp = await artist_helper.get_artist_by_id(req.params.artist_id);
  if (artist_resp.status === 0) {
    logger.error("Error occured while finding promoter by id - ", req.params.artist_id, artist_resp.error);
    res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error has occured while finding artist" });
  } else if (artist_resp.status === 2) {
    logger.trace("Artist not found in artist email verify API");
    res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid token entered" });
  } else {
    // Promoter available
    if (artist_resp.artist.email_verified) {
      // Email already verified
      logger.trace("artist already verified");
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Email already verified" });
    } else {
      // Verify email
      logger.trace("Valid request for email verification - ", artist_resp.artist._id);

      var update_resp = await artist_helper.update_artist_by_id(artist_resp.artist._id, { "email_verified": true, "status": true });
      if (update_resp.status === 0) {
        logger.trace("Error occured while updating artist : ", update_resp.error);
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while verifying artist's email" });
      } else if (update_resp.status === 2) {
        logger.trace("Artist has not updated");
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Error occured while verifying artist's email" });
      } else {
        // Email verified!
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Email has been verified" });
      }
    }
  }
});


/**
 * @api {post} /artist_login Artist Login
 * @apiName Artist Login
 * @apiGroup Root
 * 
 * @apiDescription  Login request for artist role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email 
 * @apiParam {String} password Password
 * 
 * @apiSuccess (Success 200) {JSON} artist Artist object.
 * @apiSuccess (Success 200) {String} token Unique token which needs to be passed in subsequent requests.
 * @apiSuccess (Success 200) {String} refresh_token Unique token which needs to be passed to generate next access token.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/artist_login', async (req, res) => {

  logger.trace("API - artist login called");
  logger.debug("req.body = ", req.body);

  var schema = {
    'email': {
      notEmpty: true,
      errorMessage: "Email is required.",
      isEmail: { errorMessage: "Please enter valid email address" }
    },
    'password': {
      notEmpty: true,
      errorMessage: "password is required."
    },

  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    let login_resp = await artist_helper.get_login_by_email(req.body.email);
    logger.trace("Login checked resp = ", login_resp);
    if (login_resp.status === 0) {
      logger.trace("Login checked resp = ", login_resp);
      logger.error("Error in finding by email in login API. Err = ", login_resp.err);

      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Something went wrong while finding artist", "error": login_resp.error });
    } else if (login_resp.status === 1) {
      logger.trace("Artist found. Executing next instruction");
      logger.trace("valid token. Generating token");
      var refreshToken = jwt.sign({ id: login_resp.artist._id }, config.REFRESH_TOKEN_SECRET_KEY, {});
      let update_resp = await artist_helper.update_artist_by_id(login_resp.artist._id, { "refresh_token": refreshToken, "last_login_date": Date.now() });
      var LoginJson = { id: login_resp.artist._id, email: login_resp.email, role: "artist" };
      var token = jwt.sign(LoginJson, config.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
      });


      delete login_resp.artist.status;
      delete login_resp.artist.password;
      delete login_resp.artist.refresh_token;
      delete login_resp.artist.last_login_date;
      delete login_resp.artist.created_at;

      logger.info("Token generated");
      res.status(config.OK_STATUS).json({ "status": 1, "message": "Logged in successful", "artist": login_resp.artist, "token": token, "refresh_token": refreshToken });
    } else {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid email address or token" });
    }

  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});



/**
 * @api {post} /user_registration User Registration
 * @apiName User Registration
 * @apiGroup Root
 * 
 * @apiDescription  Registration request for User role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 

 * @apiParam {Array} music_type Type of music
 * @apiParam {String} email Email address
 * @apiParam {String}  password Password
 * @apiParam {String} last_name Last Name
 * @apiParam {String} first_name First Name
 * @apiParam {String} zipcode Zipcode
 * @apiParam {String} gender Gender

 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/user_registration', async (req, res) => {

  logger.trace("API - Promoter signup called");
  logger.debug("req.body = ", req.body);
  var schema = {
    /*  "social_media": {
        notEmpty: true,
        errorMessage: "social media is required"
      },*/
    "music_type": {
      notEmpty: true,
      errorMessage: "Music Type is required"
    },
    "email": {
      notEmpty: true,
      errorMessage: "Email is required"
    },
    "password": {
      notEmpty: true,
      errorMessage: "password is required"
    },
    "last_name": {
      notEmpty: true,
      errorMessage: "last name is required"
    },
    "first_name": {
      notEmpty: true,
      errorMessage: "first name is required"
    },
    "zipcode": {
      notEmpty: true,
      errorMessage: "zipcode is required"
    },


  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    var obj = {
      "social_media": req.body.social_media,
      "email": req.body.email,
      "password": req.body.password,
      "first_name": req.body.first_name,
      "last_name": req.body.last_name,
      "zipcode": req.body.zipcode,
      "music_type": req.body.music_type
    };
    user = await user_helper.get_user_by_email(req.body.email)
    if (user.status === 2) {

      var data = await user_helper.insert_user(obj);

      if (data.status == 0) {
        logger.trace("Error occured while inserting user - User Signup API");
        logger.debug("Error = ", data.error);
        res.status(config.INTERNAL_SERVER_ERROR).json(data);
      } else {
        logger.trace("User has been inserted");
        // Send email confirmation mail to user
        logger.trace("sending mail");
        let mail_resp = await mail_helper.send("email_confirmation", {
          "to": data.user.email,
          "subject": "Music Social Voting - Email confirmation"
        }, {
            "confirm_url": config.website_url + "/email_confirm/" + data.user._id
          });
        if (mail_resp.status === 0) {
          res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
        } else {
          res.status(config.OK_STATUS).json({ "status": 1, "message": "User registered successfully" });
        }
      }
    } else {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "User's email already exist" });
    }
  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});


/**
 * @api {get} /user_email_verify/:user_id User email verification
 * @apiName User email verification
 * @apiGroup Root
 * 
 * @apiDescription  Email verification request for user
 * 
 * @apiSuccess (Success 200) {String} message Success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.get('/user_email_verify/:user_id', async (req, res) => {
  var user_resp = await user_helper.get_user_by_id(req.params.user_id);
  if (user_resp.status === 0) {
    logger.error("Error occured while finding user by id - ", req.params.user_id, user_resp.error);
    res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error has occured while finding user" });
  } else if (user_resp.status === 2) {
    logger.trace("User not found in artist email verify API");
    res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid token entered" });
  } else {
    // Promoter available
    if (user_resp.user.email_verified) {
      // Email already verified
      logger.trace("user already verified");
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Email already verified" });
    } else {
      // Verify email
      logger.trace("Valid request for email verification - ", user_resp.user._id);

      var update_resp = await user_helper.update_user_by_id(user_resp.user._id, { "email_verified": true, "status": true });
      if (update_resp.status === 0) {
        logger.trace("Error occured while updating artist : ", update_resp.error);
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while verifying user's email" });
      } else if (update_resp.status === 2) {
        logger.trace("Artist has not updated");
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Error occured while verifying user's email" });
      } else {
        // Email verified!
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Email has been verified" });
      }
    }
  }
});


/**
 * @api {post} /user_login User Login
 * @apiName User Login
 * @apiGroup Root
 * 
 * @apiDescription  Login request for user role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email 
 * @apiParam {String} password Password
 * 
 * @apiSuccess (Success 200) {JSON} user User object.
 * @apiSuccess (Success 200) {String} token Unique token which needs to be passed in subsequent requests.
 * @apiSuccess (Success 200) {String} refresh_token Unique token which needs to be passed to generate next access token.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/user_login', async (req, res) => {
  var schema = {
    'email': {
      notEmpty: true,
      errorMessage: "Email is required.",
      isEmail: { errorMessage: "Please enter valid email address" }
    },
    'password': {
      notEmpty: true,
      errorMessage: "password is required."
    },

  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    let login_resp = await user_helper.get_login_by_email(req.body.email);
    logger.trace("Login checked resp = ", login_resp);
    if (login_resp.status === 0) {
      logger.trace("Login checked resp = ", login_resp);
      logger.error("Error in finding by email in login API. Err = ", login_resp.err);

      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Something went wrong while finding artist", "error": login_resp.error });
    } else if (login_resp.status === 1) {
      logger.trace("Artist found. Executing next instruction");
      logger.trace("valid token. Generating token");
      var refreshToken = jwt.sign({ id: login_resp.user._id }, config.REFRESH_TOKEN_SECRET_KEY, {});
      let update_resp = await user_helper.update_user_by_id(login_resp.user._id, { "refresh_token": refreshToken, "last_login_date": Date.now() });
      var LoginJson = { id: login_resp.user._id, email: login_resp.email, role: "user" };
      var token = jwt.sign(LoginJson, config.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
      });


      delete login_resp.user.status;
      delete login_resp.user.password;
      delete login_resp.user.refresh_token;
      delete login_resp.user.last_login_date;
      delete login_resp.user.created_at;

      logger.info("Token generated");
      res.status(config.OK_STATUS).json({ "status": 1, "message": "Logged in successful", "user": login_resp.user, "token": token, "refresh_token": refreshToken });
    } else {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid email address or token" });
    }

  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});


/**
 * @api {post} /artist_forgot_password Artist forgot password
 * @apiName Artist forgot password
 * @apiGroup Root
 * 
 * @apiDescription   Forgot password request for artist role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email
 * 
 * @apiSuccess (Success 200) {String} message Appropriate success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/artist_forgot_password', async (req, res) => {
  var schema = {
    'email': {
      notEmpty: true,
      errorMessage: "Email is required.",
      isEmail: { errorMessage: "Please enter valid email address" }
    }
  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
    var resp = await artist_helper.get_artist_by_email(req.body.email);
    if (resp.status === 0) {
      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while finding artist" });
    } else if (resp.status === 2) {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No artist available with given email" });
    } else {
      // Send mail on user's email address
      var reset_token = Buffer.from(jwt.sign({ "artist_id": resp.artist._id }, config.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 2 // expires in 2 hour
      })).toString('base64');

      let mail_resp = await mail_helper.send("reset_password", {
        "to": resp.artist.email,
        "subject": "Music Social Voting"
      }, {
          "reset_link": config.website_url + "/forgot_password/" + reset_token
        });

      if (mail_resp.status === 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending mail to artist", "error": mail_resp.error });
      } else {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Reset link has been sent on your email address" });
      }
    }
  } else {
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});


/**
 * @api {post} /artist_reset_password Artist reset password
 * @apiName Artist reset password
 * @apiGroup Root
 * 
 * @apiDescription   Reset password request for artist role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} token Reset password token
 * @apiParam {String} password New password
 * 
 * @apiSuccess (Success 200) {String} message Appropriate success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/artist_reset_password', async (req, res) => {
  var schema = {
    'token': {
      notEmpty: true,
      errorMessage: "Reset password token is required."
    },
    'password': {
      notEmpty: true,
      errorMessage: "Password is required."
    }
  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    logger.trace("Verifying JWT");
    jwt.verify(Buffer.from(req.body.token, 'base64').toString(), config.ACCESS_TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          logger.trace("Link has expired");
          res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Link has been expired" });
        } else {
          logger.trace("Invalid link");
          res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid token sent" });
        }
      } else {
        if (decoded.artist_id) {
          var update_resp = await artist_helper.update_artist_by_id(decoded.artist_id, { "password": bcrypt.hashSync(req.body.password, saltRounds) });
          if (update_resp.status === 0) {
            logger.trace("Error occured while updating artist : ", update_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while verifying artist's email" });
          } else if (update_resp.status === 2) {
            logger.trace("artist has not updated");
            res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Error occured while reseting password of artist" });
          } else {
            // Password reset!
            logger.trace("Password has been changed for artist - ", decoded.artist_id);
            res.status(config.OK_STATUS).json({ "status": 1, "message": "Password has been changed" });
          }
        } else {
        }
      }
    });
  } else {
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});


/**
 * @api {post} /user_forgot_password User forgot password
 * @apiName User forgot password
 * @apiGroup Root
 * 
 * @apiDescription   Forgot password request for user role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email
 * 
 * @apiSuccess (Success 200) {String} message Appropriate success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/user_forgot_password', async (req, res) => {
  var schema = {
    'email': {
      notEmpty: true,
      errorMessage: "Email is required.",
      isEmail: { errorMessage: "Please enter valid email address" }
    }
  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
    var resp = await user_helper.get_user_by_email(req.body.email);
    if (resp.status === 0) {
      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while finding user" });
    } else if (resp.status === 2) {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No user available with given email" });
    } else {
      // Send mail on user's email address
      var reset_token = Buffer.from(jwt.sign({ "user_id": resp.user._id }, config.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 2 // expires in 2 hour
      })).toString('base64');

      let mail_resp = await mail_helper.send("reset_password", {
        "to": resp.artist.email,
        "subject": "Music Social Voting"
      }, {
          "reset_link": config.website_url + "/forgot_password/" + reset_token
        });

      if (mail_resp.status === 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending mail to user", "error": mail_resp.error });
      } else {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Reset link has been sent on your email address" });
      }
    }
  } else {
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});



/**
 * @api {post} /user_reset_password User reset password
 * @apiName User reset password
 * @apiGroup Root
 * 
 * @apiDescription   Reset password request for user role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} token Reset password token
 * @apiParam {String} password New password
 * 
 * @apiSuccess (Success 200) {String} message Appropriate success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/user_reset_password', async (req, res) => {
  var schema = {
    'token': {
      notEmpty: true,
      errorMessage: "Reset password token is required."
    },
    'password': {
      notEmpty: true,
      errorMessage: "Password is required."
    }
  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    logger.trace("Verifying JWT");
    jwt.verify(Buffer.from(req.body.token, 'base64').toString(), config.ACCESS_TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          logger.trace("Link has expired");
          res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Link has been expired" });
        } else {
          logger.trace("Invalid link");
          res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid token sent" });
        }
      } else {
        logger.trace("Valid token. Reseting password for promoter");
        if (decoded.user_id) {
          var update_resp = await promoter_helper.update_user_by_id(decoded.user_id, { "password": bcrypt.hashSync(req.body.password, saltRounds) });
          if (update_resp.status === 0) {
            logger.trace("Error occured while updating artist : ", update_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while verifying user_id's email" });
          } else if (update_resp.status === 2) {
            logger.trace("artist has not updated");
            res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Error occured while reseting password of user" });
          } else {
            // Password reset!
            logger.trace("Password has been changed for artist - ", decoded.user_id);
            res.status(config.OK_STATUS).json({ "status": 1, "message": "Password has been changed" });
          }
        } else {

        }
      }
    });
  } else {
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});




/**
 * @api {post} /artist_by_filter Get all artist
 * @apiName Get all artist
 * @apiGroup Root
 * @apiParam {Number} page_no Page Number
 * @apiParam {Number} page_size Page Size
 * @apiParam {String} social_media Social Media for filter
 * @apiParam {String} music_type Music Type for filter
 * @apiParam {String} first_name First Name for filter
 * @apiParam {String} first_name Last Name for filter
 * @apiSuccess (Success 200) {Array} artist Array of artist document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post("/artist_by_filter", async (req, res) => {
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
  req.checkBody(schema);
  var errors = req.validationErrors();

  if (req.body.social_media) {
    filter.social_media = req.body.social_media;
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
  if (req.body.gender) {
    filter.gender = req.body.gender;
  }
  if (!errors) {
    var resp_data = await artist_helper.get_all_artist(filter, req.body.page_no, req.body.page_size);
    if (resp_data.status == 0) {
      logger.error("Error occured while fetching artist = ", resp_data);
      res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
      logger.trace("artist got successfully = ", resp_data);
      res.status(config.OK_STATUS).json(resp_data);
    }
  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});



/**
 * @api {post} /musics Get all tracks
 * @apiName Get all tracks
 * @apiGroup Root
 * @apiParam {Number} page_no Page Number
 * @apiParam {Number} page_size Page Size
 * @apiParam {String} music_type Music Type for filter
 * @apiParam {String} artist_id Artist Id for filter
 * @apiParam {String} name Track Name for filter
 * @apiSuccess (Success 200) {Array} tracks Array of tracks document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post("/musics", async (req, res) => {
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
  req.checkBody(schema);
  var errors = req.validationErrors();

  if (req.body.music_type) {
    filter.music_type = new ObjectId(req.body.music_type);
  }
  if (req.body.artist_id) {
    filter.artist_id = new ObjectId(req.body.artist_id);
  }
  if (req.body.name) {
    filter.name = req.body.name;
  }
  if (!errors) {
    var resp_data = await track_helper.get_all_audio(filter, req.body.page_no, req.body.page_size);
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
 * @api {post} /login Admin Login
 * @apiName Admin Login
 * @apiGroup Root
 * 
 * @apiDescription  Login request for admin role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email 
 * @apiParam {String} password Password
 * 
 * @apiSuccess (Success 200) {JSON}  admin object.
 * @apiSuccess (Success 200) {String} token Unique token which needs to be passed in subsequent requests.
 * @apiSuccess (Success 200) {String} refresh_token Unique token which needs to be passed to generate next access token.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/login', async (req, res) => {
  var schema = {
    'email': {
      notEmpty: true,
      errorMessage: "Email is required.",
      isEmail: { errorMessage: "Please enter valid email address" }
    },
    'password': {
      notEmpty: true,
      errorMessage: "password is required."
    },

  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    let login_resp = await admin_helper.get_login_by_email(req.body.email, req.body.password);
    if (login_resp.status === 0) {
      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Something went wrong while finding admin", "error": login_resp.error });
    } else if (login_resp.status === 1) {
      logger.trace("Admin found. Executing next instruction");
      logger.trace("valid token. Generating token");
      var refreshToken = jwt.sign({ id: login_resp.admin._id }, config.REFRESH_TOKEN_SECRET_KEY, {});
      let update_resp = await admin_helper.update_admin_by_id(login_resp.admin._id, { "refresh_token": refreshToken, "last_login_date": Date.now() });
      var LoginJson = { id: login_resp.admin._id, email: login_resp.email, role: "admin" };
      var token = jwt.sign(LoginJson, config.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
      });


      delete login_resp.admin.status;
      delete login_resp.admin.password;
      delete login_resp.admin.refresh_token;
      delete login_resp.admin.last_login_date;
      delete login_resp.admin.created_at;

      logger.info("Token generated");
      res.status(config.OK_STATUS).json({ "status": 1, "message": "Logged in successful", "admin": login_resp.admin, "token": token, "refresh_token": refreshToken });
    } else {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid email address or token" });
    }

  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});



/**
 * @api {post} /forgot_password Admin forgot password
 * @apiName Admin forgot password
 * @apiGroup Root
 * 
 * @apiDescription   Forgot password request for admin role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email
 * 
 * @apiSuccess (Success 200) {String} message Appropriate success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/forgot_password', async (req, res) => {
  var schema = {
    'email': {
      notEmpty: true,
      errorMessage: "Email is required.",
      isEmail: { errorMessage: "Please enter valid email address" }
    }
  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
    var resp = await admin_helper.get_admin_by_email(req.body.email);
    if (resp.status === 0) {
      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while finding admin" });
    } else if (resp.status === 2) {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No admin available with given email" });
    } else {
      // Send mail on user's email address
      var reset_token = Buffer.from(jwt.sign({ "admin_id": resp.admin._id }, config.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 2 // expires in 2 hour
      })).toString('base64');

      let mail_resp = await mail_helper.send("reset_password", {
        "to": resp.admin.email,
        "subject": "Music Social Voting"
      }, {
          "reset_link": config.website_url + "/forgot_password/" + reset_token
        });

      if (mail_resp.status === 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending mail to admin", "error": mail_resp.error });
      } else {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Reset link has been sent on your email address" });
      }
    }
  } else {
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});


/**
 * @api {post} /reset_password Admin reset password
 * @apiName Admin reset password
 * @apiGroup Root
 * 
 * @apiDescription   Reset password request for admin role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} token Reset password token
 * @apiParam {String} password New password
 * 
 * @apiSuccess (Success 200) {String} message Appropriate success message
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/reset_password', async (req, res) => {

  var schema = {
    'token': {
      notEmpty: true,
      errorMessage: "Reset password token is required."
    },
    'password': {
      notEmpty: true,
      errorMessage: "Password is required."
    }
  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    logger.trace("Verifying JWT");
    jwt.verify(Buffer.from(req.body.token, 'base64').toString(), config.ACCESS_TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          logger.trace("Link has expired");
          res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Link has been expired" });
        } else {
          logger.trace("Invalid link");
          res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid token sent" });
        }
      } else {
        logger.trace("Valid token. Reseting password for promoter");
        if (decoded.admin_id) {
          var update_resp = await admin_helper.update_admin_by_id(decoded.admin_id, { "password": bcrypt.hashSync(req.body.password, saltRounds) });
          if (update_resp.status === 0) {
            logger.trace("Error occured while updating admin : ", update_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while verifying admin_id's email" });
          } else if (update_resp.status === 2) {
            logger.trace("admin has not updated");
            res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Error occured while reseting password of admin" });
          } else {
            // Password reset!
            logger.trace("Password has been changed for admin - ", decoded.admin_id);
            res.status(config.OK_STATUS).json({ "status": 1, "message": "Password has been changed" });
          }
        } else {

        }
      }
    });
  } else {
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});


/**
 * @api {post} /super_admin_login Super Admin Login
 * @apiName Super Admin Login
 * @apiGroup Root
 * 
 * @apiDescription  Login request for admin role
 * 
 * @apiHeader {String}  Content-Type application/json
 * 
 * @apiParam {String} email Email 
 * @apiParam {String} password Password
 * 
 * @apiSuccess (Success 200) {JSON}  admin object.
 * @apiSuccess (Success 200) {String} token Unique token which needs to be passed in subsequent requests.
 * @apiSuccess (Success 200) {String} refresh_token Unique token which needs to be passed to generate next access token.
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/super_admin_login', async (req, res) => {
  var schema = {
    'email': {
      notEmpty: true,
      errorMessage: "Email is required.",
      isEmail: { errorMessage: "Please enter valid email address" }
    },
    'password': {
      notEmpty: true,
      errorMessage: "password is required."
    },

  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
    let login_resp = await super_admin_helper.get_login_by_email(req.body.email, req.body.password);
    if (login_resp.status === 0) {
      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Something went wrong while finding admin", "error": login_resp.error });
    } else if (login_resp.status === 1) {
      logger.trace("Admin found. Executing next instruction");
      logger.trace("valid token. Generating token");
      var refreshToken = jwt.sign({ id: login_resp.super_admin._id }, config.REFRESH_TOKEN_SECRET_KEY, {});
      let update_resp = await admin_helper.update_admin_by_id(login_resp.super_admin._id, { "refresh_token": refreshToken, "last_login_date": Date.now() });
      var LoginJson = { id: login_resp.super_admin._id, email: login_resp.email, role: "super_admin" };
      var token = jwt.sign(LoginJson, config.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
      });


      delete login_resp.super_admin.status;
      delete login_resp.super_admin.password;
      delete login_resp.super_admin.refresh_token;
      delete login_resp.super_admin.last_login_date;
      delete login_resp.super_admin.created_at;

      logger.info("Token generated");
      res.status(config.OK_STATUS).json({ "status": 1, "message": "Logged in successful", "super_admin": login_resp.admin, "token": token, "refresh_token": refreshToken });
    } else {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid email address or token" });
    }

  } else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});


router.get("/music_type", async (req, res) => {
  var resp_data = await music_helper.get_all_music_type();
  if (resp_data.status == 0) {
    logger.error("Error occured while fetching music = ", resp_data);
    res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
  } else {
    logger.trace("Music got successfully = ", resp_data);
    res.status(config.OK_STATUS).json(resp_data);
  }
});

module.exports = router;

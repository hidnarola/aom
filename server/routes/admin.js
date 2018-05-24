var express = require("express");
var router = express.Router();

var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");
var config = require ('./../config')
var index = require('./admin/index');
var artist = require('./admin/artist');
var user = require('./admin/user');
var track = require('./admin/track');


router.use("/",auth, authorization, index);
router.use("/track",auth, authorization, track);
router.use("/artist",auth, authorization, artist);
router.use("/user",auth, authorization, user);



module.exports = router;
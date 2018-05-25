var express = require("express");
var router = express.Router();

var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");
var config = require ('./../config')

var index = require('./user/index');
var bookmark = require ('./user/bookmark');
var comment = require ('./user/comment');
var track = require ('./user/track');
var playlist = require ('./user/playlist');
var artist = require ('./user/artist');

router.use("/",auth, authorization, index);
router.use("/bookmark",auth, authorization, bookmark);
router.use("/comment",auth, authorization, comment);
router.use("/track",auth, authorization, track);
router.use("/artist",auth, authorization, artist);

module.exports = router;
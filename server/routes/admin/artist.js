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


module.exports = router;
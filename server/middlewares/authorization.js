var config = require('../config');

module.exports = function (req, res, next) {
    if (req.decoded.role == "artist" && req.baseUrl.match('/artist')) {
        req.userInfo = req.decoded;
        next();
    } else if (req.decoded.role == "user" && req.baseUrl.match('/user')) {
        req.userInfo = req.decoded;
        next();
    } else if (req.decoded.role == "admin" && req.baseUrl.match('/admin')) {
        req.userInfo = req.decoded;
        next();
    }
    else if (req.decoded.role == "super_admin" && req.baseUrl.match('/super_admin')) {
        req.userInfo = req.decoded;
        next();
    } else if (req.decoded.role == "both") {
        req.userInfo = req.decoded;
        next();
    } else {
        return res.status(config.UNAUTHORIZED).json({
            "message": 'Unauthorized access'
        });
    }
}
var jwt = require('jsonwebtoken');

var Moderator = require("./../models/moderator");
var moderator_helper = {};


admin_helper.get_login_by_email = async (email,password) => {
    try {
        var moderator = await Moderator.findOne({ "email": email ,"password" :password }).lean();
        if (admin) {
            return { "status": 1, "message": "login successful", "moderator": moderator };
        } else {
            return { "status": 2, "message": "email or password invalid" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding moderator", "error": err }
    }
};


moderator_helper.get_moderator_by_email = async (email) => {
    try {
        var moderator = await Moderator.findOne({"email": email}).lean();
        if (moderator) {
            return { "status": 1, "message": "moderator details found", "moderator": moderator };
        } else {
            return { "status": 2, "message": "moderator not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding moderator", "error": err }
    }
};


moderator_helper.update_moderator_by_id = async (user_id, object) => {
    try {
        let moderator = await Moderator.findOneAndUpdate(object);
        if (!moderator) {
            return { "status": 2, "message": "Record has not updated" };
        } else {
            return { "status": 1, "message": "Record has been updated", "moderator": moderator };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while updating moderator", "error": err }
    }
};

module.exports = moderator_helper;
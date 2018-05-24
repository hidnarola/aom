var jwt = require('jsonwebtoken');

var Super_Admin = require("./../models/super_admin");
var super_admin_helper = {};


super_admin_helper.get_login_by_email = async (email,password) => {
    try {
        var super_admin = await Super_Admin.findOne({ "email": email ,"password" :password }).lean();
        if (super_admin) {
            return { "status": 1, "message": "login successful", "super_admin": super_admin };
        } else {
            return { "status": 2, "message": "email or password invalid" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding admin", "error": err }
    }
};


super_admin_helper.get_admin_by_email = async (email) => {
    try {
        var super_admin = await Super_Admin.findOne({"email": email}).lean();
        if (super_admin) {
            return { "status": 1, "message": "admin details found", "super_admin": super_admin };
        } else {
            return { "status": 2, "message": "admin not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding admin", "error": err }
    }
};


super_admin_helper.update_admin_by_id = async (user_id, object) => {
    try {
        let super_admin = await Super_Admin.findOneAndUpdate(object);
        if (!super_admin) {
            return { "status": 2, "message": "Record has not updated" };
        } else {
            return { "status": 1, "message": "Record has been updated", "super_admin": super_admin };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while updating admin", "error": err }
    }
};


module.exports = super_admin_helper;
var jwt = require('jsonwebtoken');

var Permission = require("./../models/permission");
var permission_helper = {};



permission_helper.insert_permission = async (object) => {
    let perm = new Permission(object)
    try {
        let super_admin = await perm.save();
        return { "status": 1, "message": "Record inserted", "permission": super_admin };
    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting bookmark", "error": err };
    }
};
module.exports = permission_helper;
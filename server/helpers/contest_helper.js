var Contest = require("./../models/contest");
var contest_helper = {};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


contest_helper.insert_contest = async (object) => {
    let contest = new Contest(object)
    try {
        let contests = await contest.save();
        return { "status": 1, "message": "Record inserted", "contest": contests };
    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting contest", "error": err };
    }
};
contest_helper.get_contest_by_id = async (id) => {
    try {
        var contest = await Contest
            .findOne({ "_id": new ObjectId(id) })
        if (contest ) {
            return { "status": 1, "message": "contest details found", "contest": contest };
        } else {
            return { "status": 2, "message": "contest not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding contest", "error": err }
    }
};

contest_helper.update_participant = async (id,no_participants) => {
    try {
        var contest = await Contest.findOneAndUpdate({"_id": new ObjectId(id) },{"no_of_participants":no_participants})
        if (contest ) {
            return { "status": 1, "message": "contest updated", };
        } else {
            return { "status": 2, "message": "contest not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding contest", "error": err }
    }
};

contest_helper.get_all_contest_and_participant = async ()  => {
    try {
        var participate = await Contest.find({},{"name":1,"start_date" :1,"end_date" :1,"music_type":1,"location" :1,"no_of_participants" :1})
        if (participate) {
            return { "status": 1, "message": "participants details found", "participate": participate };
        } else {
            return { "status": 2, "message": "participants not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding participants", "error": err }
    }
}
module.exports = contest_helper;
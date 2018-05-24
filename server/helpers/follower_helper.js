var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var moment = require('moment');

var Followers = require("../models/follow");
var follower_helper = {};

follower_helper.follow_artist = async (object) => {
    let follow = new Followers(object)
    try {
        let follows = await follow.save();
        return { "status": 1, "message": "Record inserted", "follows": follow };
    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting bookmark", "error": err };
    }
};


follower_helper.get_artist_followers_by_gender = async (artist_id, day) => {

    var to = moment();
    var from = moment(to).subtract(day, "days");

    console.log("to:", to)
    console.log("from:", from)

    var aggregate = [
        {
            "$match":
                {
                    "created_at": { "$gt": new Date(from), "$lt": new Date(to) },
                    "artist_id": new ObjectId(artist_id)
                },
        },
        {
            $lookup: {
                from: "user",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $group: {
                _id: "$user.gender",
                count: { $sum: 1 }

            }
        },

        {
            "$group": {
                "_id": null,
                "gender": { $push: "$$ROOT" },
                "total": { $sum: "$count" },

            }
        },
        {
            "$unwind": "$gender"
        },
        {
            $addFields: {
                "gender.percentage_value": { "$multiply": [{ "$divide": ["$gender.count", "$total"] }, 100] }
            }
        },
    ];

    let result = await Followers.aggregate(aggregate);
    if (result && result.length > 0) {
        return { "status": 1, "message": "followers  found", "results": result }
    } else {
        return { "status": 2, "message": "No  available followers" }
    }

};



follower_helper.get_artist_followers_by_day = async (artist_id, day) => {

    var to = moment().utcOffset(0);
    var from = moment(to).subtract(day, "days").utcOffset(0);

    console.log("to:", to)
    console.log("from:", from)

    var aggregate = [
        {
            "$match":
                {
                    "created_at": { "$gt": new Date(from), "$lt": new Date(to) },
                    "artist_id": new ObjectId(artist_id)
                },
        },
        {
            $group: {
                _id: { days: { $dayOfWeek: "$created_at" } },
                count: { $sum: 1 }
            }
        },
    ];

    let result = await Followers.aggregate(aggregate);
    if (result && result.length > 0) {
        return { "status": 1, "message": "followers  found", "results": result }
    } else {
        return { "status": 2, "message": "No  available followers" }
    }

};



follower_helper.get_artist_followers_by_age = async (artist_id, day) => {

    var to = moment().utcOffset(0);
    var from = moment(to).subtract(day, "days").utcOffset(0);


    var aggregate = [
        {
            "$match":
                {
                    "created_at": { "$gt": new Date(from), "$lt": new Date(to) },
                    "artist_id": new ObjectId(artist_id)
                },
        },
        {
            $lookup: {
                from: "user",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },

        {
            "$group": {
                _id:
                    {
                        year: { $year: "$user.dob" },
                        month: { $month: "$user.dob" },
                        day: { $dayOfMonth: "$user.dob" },
                    },
                count:{$sum:1}                     
            }
        },
        {
            "$project":
                {
                    _id: 0,
                    age: { $subtract: [{ $year: new Date() }, "$_id.year"] },                
                    data: 1,
                    count:1

                }
        },
        


    ];

    let result = await Followers.aggregate(aggregate);
    if (result && result.length > 0) {
        return { "status": 1, "message": "followers  found", "results": result }
    } else {
        return { "status": 2, "message": "No  available followers" }
    }

};

module.exports = follower_helper;
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = require("./../models/user");
var user_helper = {};

/*
 * insert_user is used to insert into user collection
 * 
 * @param   object     JSON object consist of all property that need to insert in collection
 * 
 * @return  status  0 - If any error occur in inserting user, with error
 *          status  1 - If user inserted, with inserted user's document and appropriate message
 * 
 */
user_helper.insert_user = async (object) => {
    let user = new User(object)
    try {
        let data = await user.save();
        return { "status": 1, "message": "Record inserted", "user": data };
    } catch (err) {
        return { "status": 0, "message": "Error occured while inserting user", "error": err };
    }
};


/*
 * get_user_by_email is used to fetch single user by email address
 * 
 * @param   email   Specify email address of user
 * 
 * @return  status  0 - If any error occur in finding user, with error
 *          status  1 - If User found, with found user document
 *          status  2 - If User not found, with appropriate error message
 * 
 */
user_helper.get_user_by_email = async (email) => {
    try {
        var user = await User.findOne({ "$or" : [{"email": email} , {"email":email}] }).lean();
        if (user) {
            return { "status": 1, "message": "user details found", "user": user };
        } else {
            return { "status": 2, "message": "user not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding user", "error": err }
    }
};



/*
 * get_user_by_id is used to fetch user details by user id
 * 
 * @params  user_id     _id field of user collection
 * 
 * @return  status 0 - If any internal error occured while fetching user data, with error
 *          status 1 - If user data found, with user object
 *          status 2 - If user not found, with appropriate message
 */
user_helper.get_user_by_id = async (user_id) => {
    try {
        var user = await User.findOne({ "_id": { "$eq": user_id } });
        if (user) {
            return { "status": 1, "message": "user details found", "user": user };
        } else {
            return { "status": 2, "message": "user not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding user", "error": err }
    }
};



/*
 * update_user_by_id is used to update user data based on user_id
 * 
 * @param   user_id         String  _id of user that need to be update
 * @param   object     JSON    object consist of all property that need to update
 * 
 * @return  status  0 - If any error occur in updating user, with error
 *          status  1 - If User updated successfully, with appropriate message
 *          status  2 - If User not updated, with appropriate message
 * 
 */
user_helper.update_user_by_id = async (user_id, object) => {
    try {

        let user = await User.findOneAndUpdate({ _id: user_id }, object);
        if (!user) {
            return { "status": 2, "message": "Record has not updated" };
        } else {
            return { "status": 1, "message": "Record has been updated", "user": user };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while updating user", "error": err }
    }
};


user_helper.get_login_by_email = async (email) => {
    try {
        var user = await User.findOne({ "email": email }).lean();
        if (user) {
            return { "status": 1, "message": "user details found", "user": user };
        } else {
            return { "status": 2, "message": "user not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding user", "error": err }
    }
};


user_helper.get_users_by_filter = async (filter,page_no, page_size) => {
    try {
           var user  = await User           
            .find(filter)
            .skip((page_size * page_no) - page_size)
            .limit(page_size)
            .lean();  
   
        if (user && user.length > 0) {
            return { "status": 1, "message": "user details found", "user": user };
        } else {
            return { "status": 2, "message": "user not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding user", "error": err }
    }
};


user_helper.delete_user_by_admin = async (user_id) => {

    try {
        var user = await User.findOneAndRemove({ "_id": (user_id)})
        if (user ) {
            return { "status": 1, "message": "user details found", "user":  user };
        } else {
            return { "status": 2, "message": "user not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding user", "error": err }
    }
};


user_helper.update_user_status = async (user_id,status) => {

    try {
        console.log("1");
        var user = await User.findOneAndUpdate({ "_id": new ObjectId(user_id) },{ "status": status });
        
        console.log("2",user);
        if (user) {
            return { "status": 1, "message": "user status updated", };
        } else {
            return { "status": 2, "message": "user status found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while updating user status", "error": err }
    }
};

user_helper.update_user_for_votes = async (id, no_vote) => {
    try {
        var contest = await User.findOneAndUpdate({ "_id": new ObjectId(id) }, { "no_of_votes": no_vote })
        if (contest) {
            return { "status": 1, "message": "contest updated", };
        } else {
            return { "status": 2, "message": "contest not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding contest", "error": err }
    }
};
user_helper.update_user_for_likes = async (id, no_like) => {
    try {
        var contest = await User.findOneAndUpdate({ "_id": new ObjectId(id) }, { "no_of_likes": no_like })
        if (contest) {
            return { "status": 1, "message": "likes updated", };
        } else {
            return { "status": 2, "message": "likes not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding likes", "error": err }
    }
};

user_helper.update_user_for_followers = async (id, no_follow) => {
    try {
        var contest = await User.findOneAndUpdate({ "_id": new ObjectId(id) }, { "no_of_followers": no_follow })
        if (contest) {
            return { "status": 1, "message": "followers updated", };
        } else {
            return { "status": 2, "message": "followers not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while following", "error": err }
    }
};
user_helper.update_user_for_comments = async (id, no_comment) => {
    try {
        var contest = await User.findOneAndUpdate({ "_id": new ObjectId(id) }, { "no_of_comments": no_comment })
        if (contest) {
            return { "status": 1, "message": "comments updated", };
        } else {
            return { "status": 2, "message": "comments not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while commenting", "error": err }
    }
};

user_helper.get_all_active_and_suspend_user = async (filter) => {
    try {
        console.log('filter',filter);
        

        var user = await User
            .find(filter, {
                "first_name": 1,
                "last_name": 1,
                "gender": 1,
                "music_type": 1,
                "status" :1,
                "no_of_votes" : 1,
                "no_of_likes" : 1,
                "no_of_followers" : 1,
                "no_of_comments" : 1,
            })

        if (user && user.length > 0) {
            return { "status": 1, "message": "user details found", "user": user };
        } else {
            return { "status": 2, "message": "user not found" };
        }
    } catch (err) {
        return { "status": 0, "message": "Error occured while finding user", "error": err }
    }
};
module.exports = user_helper;
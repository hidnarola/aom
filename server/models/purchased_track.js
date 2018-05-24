//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var PurchasedModelSchema = new Schema({
    user_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    track_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'track' }, // 7
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });



// Compile model from schema
var Purchased = mongoose.model('purchased_track', PurchasedModelSchema, 'purchased_track');

module.exports = Purchased;
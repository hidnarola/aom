//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var EmailSchema = new Schema({
    likes: { type: Number, default: 1 },
    comments: { type: Number, default: 1 },
});

var SmsSchema = new Schema({
    likes: { type: Number, default: 1 },
    comments: { type: Number, default: 1 },
});

var SiteSchema = new Schema({
    likes: { type: Number, default: 1 },
    comments: { type: Number, default: 1 },
});

var NotificationModelSchema = new Schema({
    artist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'artist' },
    email: { type: EmailSchema, default: 0 },
    sms: { type: SmsSchema, default: 0 },
    site: { type: SiteSchema, default: 0 },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

// Compile model from schema
var Notification = mongoose.model('notification', NotificationModelSchema, 'notification');

module.exports = Notification;
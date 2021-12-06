var config = require("../config");
var async = require('async');
var bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 5,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000;
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
    id: Number,
    profile_photos:[String],
    username: { type: String, select: true },
    code: String,
    nonce: Number,
    website:String,
    bio:String,
    name: { type: String, select: true },
    bio: String,
    token_name:String,
    total_tokens:Number,
    issue_price:Number,
    email: { type: String, required: true,select:true, index: { unique: true, dropDups: true } },
    address: { type: String, select: true },
    password: { type: String, select: true },
    owner_roles: [{ type: Schema.Types.ObjectId, ref: 'owner_roles' }],
    phone_number: { type: String, select: true },
    is_verified: { type: Boolean, default: false },
    is_email_verified: { type: Boolean, default: false },
    is_phone_verified: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    owner_type: { type: String, default: 'owner' },
    created_on: Number,
    start_date: Number,
    created_by: { type: Schema.Types.ObjectId, ref: 'owners' },
    working_day: { type: Schema.Types.ObjectId, ref: 'working_days' },
    updates: {
        type: [{
            working_day: { type: Schema.Types.ObjectId, ref: 'working_days' },
            update_on: Number,
            update_by: { type: Schema.Types.ObjectId, ref: 'owners' }
        }],
        select: false
    },

    deleted_on: Number,
    deleted: Boolean,
    deleted_by: { type: Schema.Types.ObjectId, ref: 'owners' },
}, {
    usePushEach: true
});
schema.pre('save', function(next) {
    var owner = this;
    var self = this;
    var currentDate = new Date();


    async.parallel([
        function(callback) {
            if (!self.nonce) {
                var randomstring = require('randomstring');
                var nonce = randomstring.generate({
                    length: 6,
                    readable: true,
                    charset: 'numeric'
                });
                self.nonce = nonce;
                callback();
            } else {
                callback();
            }
        },
        function(callback) {
            if (!self.code) {
                var randomstring = require('randomstring');
                var code = randomstring.generate({
                    length: 8,
                    readable: true,
                    capitalization: 'uppercase'
                });
                self.code = code;
                callback();
            } else {
                callback();
            }
        },
        function(callback) {
            if (!self.created_on) {
                self.created_on = currentDate;
                self.created_by = self.last_owner;
            } else {
                ////self.updates.push({ update_on: currentDate, update_by: self.last_owner, working_day: working_day });
            }
            callback();
        }
    ], function(err) {
        
        if (!self.isModified('password')) return next();
        generatePassword(self, next);

    })

})
function generatePassword(owner, next) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(owner.password, salt, null, function(err, hash) {
            if (err) return next(err);
            owner.password = hash;
            next();
        });

    });
}
schema.methods.comparePassword = function(candidatePassword, cb) {
    var that=this;
    bcrypt.compare(candidatePassword, that.password, function(err, isMatch) {
        console.log(err,isMatch,candidatePassword,that.password);
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

schema.index({ start_date: -1 });
var Owner = mongoose.model('owners', schema);


Owner.createCollection();

module.exports = Owner;
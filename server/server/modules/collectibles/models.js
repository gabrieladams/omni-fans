var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;
var schema = new Schema({
    id: Number,
    code: String,
    owners: [{ type: Schema.Types.ObjectId, ref: 'owners' }],
    description:String,
    profile_photos:[String],

    index:Number,
    price:Number,
    putOnMarketPlace:Boolean,
    unlockOncePurchased:Boolean,
    priceType:String,
    title:String,
    royalties:Number,
    extraProperties:[{name:String,value:String}],
    type:String,

    
    note: String,
    active: Boolean,
    start_date: Number,
    created_on: Number,
    created_by:{ type: Schema.Types.ObjectId, ref: 'owners' },
    working_day: { type: Schema.Types.ObjectId, ref: 'working_days' },
    updates: {type:[{
        working_day: { type: Schema.Types.ObjectId, ref: 'working_days' },
        update_on: Number,
        update_by: { type: Schema.Types.ObjectId, ref: 'owners' }
    }],select:false},

    deleted_on: Number,
    deleted: Boolean,
    deleted_by: { type: Schema.Types.ObjectId, ref: 'owners' },
}, {
    usePushEach: true
});
schema.pre('save', function(next) {
    next();
});
schema.index({start_date:-1});
var model = mongoose.model('collectibles', schema);
model.createCollection();
module.exports = model;
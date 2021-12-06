var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;
var schema = new Schema({
    id: Number,
    total_tokens:Number,
    issue_price:String,
    name: String,
    code: String,
    owners: [{ type: Schema.Types.ObjectId, ref: 'owners' }],
    owner_type:String,
    description:String,
    profile_photos:[String],

    index:Number,
    borrower_interest_rate:Number,
    borrower_repayment_period:Number,
    borrower_minimum_repayment_balance:Number,
    borrower_minimum_repayment_balance_spread:Number,
    lender_interest_rate:Number,
    lender_holding_period:Number,
    lender_minimum_principal:Number,
    lender_maximum_principal:Number,
    staker_maximum_deposit:Number,
    staker_minimum_deposit:Number,
    staker_interest_rate:Number,
    
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
var model = mongoose.model('tokens', schema);
model.createCollection();
module.exports = model;
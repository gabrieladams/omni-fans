var Owner = require('./models.js');
var controller = require('./controllers');
var config = require('../config');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var app = require('express')();
var auth = require('../passport')();
var util = require('ethereumjs-util');
var ethsig = require('eth-sig-util');


app.use(auth.initialize());
app.set('secret', config.secret);

controller.get('/count', auth.authenticate(), function(req, res) {
    Owner.count(function(err, count) {
        res.json({ count: count });
    });
});

controller.get('/getOwnerByPublicAddress/:publicAddress', function(req, res) {
    Owner.findOne({ address: req.params.publicAddress }, function(err, owner) {
        if (!owner) {
            res.status(500).send({
                error: 'Your Address does not exist in our records, Please register first',
            });
        } else {
            res.json(owner);
        }
    })
});


controller.post('/login', function(req, res) {

    function comparePassword(owner) {

        owner.comparePassword(req.body.password, function(err, correct) {

            if (correct) {
                var token = jwt.sign({ type: owner.type, owner_type: owner.owner_type, id: owner._id }, app.get('secret'), {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });
                res.json({ success: true, owner: { _id: owner._id, ownername: owner.email,profile_photos:owner.profile_photos }, token: token })

            } else {
                res.status(500).send({ error: "Invalid Password/Email Combination" });
            }
        });
    }

    function compareSignaturePassword(owner) {
        const msg = `Sign your one-time-nonce: ${owner.nonce}, to login to omnibridge`;
        const msgBufferHex = util.bufferToHex(util.fromUtf8(msg));
        var token = jwt.sign({ type: 'metamask', owner_type: owner.owner_type, id: owner._id }, app.get('secret'), {
            expiresIn: 60 * 60 * 24 // expires in 24 hours
        });
        const address = ethsig.recoverPersonalSignature({
            data: msgBufferHex,
            sig: req.body.signature,
        });

        if (address.toLowerCase() === owner.address.toLowerCase()) {
            var randomstring = require('randomstring');
            var nonce = randomstring.generate({
                length: 6,
                readable: true,
                charset: 'numeric'
            });
            owner.nonce = nonce;
            owner.save(function() {
                res.json({ success: true, owner: { _id: owner._id, ownername: owner.email,profile_photos:owner.profile_photos }, token: token });
            });
        } else {
            res.status(500).send({
                error: 'Signature verification failed',
            });

            return null;
        }
    }
    var conditions={email:req.body.identifier};

    if(req.body.address){
        conditions={ address: req.body.address }
    }
    Owner.findOne(conditions).select('+password').exec(function(err, owner) {
        if (owner && owner.active) {
            console.log(owner)
            owner.owner_type = 'owners';
            if ((req.body.address && req.body.signature)) {
                compareSignaturePassword(owner);
            } else {

                comparePassword(owner);
            }

        } else {
            res.status(500).send({
                error: 'Owner Account is Inactive or Non existent',
            });
        }
    });
});

controller.request('delete', function(req, res, next) {
    if (req.params.id) {

        var owner = req.owner;
        if (owner && (owner.email === "owner@owner.com")) {
            req.body.deleted = true;
            req.body.deleted_by = owner._id;
            req.body.deleted_on = new Date().getTime();
            next();
        } else {
            next(new Error("Delete not authorized for account"));
        }
    } else {
        next(new Error("Invalid delete request"));
    }
});
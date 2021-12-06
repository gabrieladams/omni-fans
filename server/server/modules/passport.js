var jwt = require('passport-jwt');
var JwtStrategy = jwt.Strategy;
var ExtractJwt = jwt.ExtractJwt;
var owner = require('./owners/models.js');
var config = require('./config');
var passport=require('passport');


// Setup work and export for the JWT passport strategy
module.exports = function() {

    var opts = {};

    opts.jwtFromRequest=ExtractJwt.fromHeader('token');
    opts.secretOrKey = config.secret;


    var strategy=new JwtStrategy(opts, function(jwt_payload, done) {


        if((jwt_payload.type=='owner')||(jwt_payload.user_type=='owners')) {
            owner.findById(jwt_payload.id, function (err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        }else{
            done(new Error("Invalid credentials",false));
        }

      
        
    });

    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt",{session:false});
        }
    };
};
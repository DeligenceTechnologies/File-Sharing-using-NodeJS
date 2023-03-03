const  mongoose = require("mongoose");
mongoose.set('strictQuery', true)
require('dotenv').config();
function db(){
    mongoose.connect("var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));",{useNewUrlParser:true,useUnifiedTopology:true});
    const connection=mongoose.connection
    connection.once('open', function () {
        console.log('MongoDB running');
      })
     
    }
module.exports=db;

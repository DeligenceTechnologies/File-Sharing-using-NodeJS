/*const { ExtractJwt } = require("passport-jwt").ExtractJwt;
const jwtStrategy=require("passport-jwt").Strategy;
const users=require('./model/files')
 const opt=function (passport){
    let params={secretOrKey:"asdkfjdkdfjkffnfnfkfdbdkfkdfndfkjffkflddhfkdkfdkdfkdfjdk",
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
};
   passport.use (
        new jwtStrategy(params,function(jwt_payload,next){
         
          users.findOne({email:jwt_payload.email},function(err,emp){
            if(err){
               return  next(null,false) 
            }
            if(emp){
               return next(null,emp)
            }else{
               return  next(null,false)
            }
          });
        
    }
     )

    
   )}
   module.exports=opt*/
   
const passport=require('passport');
   const JwtStrategy = require('passport-jwt').Strategy
   const User=require('./model/files');
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'rANDOMSTRIGN';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({username: jwt_payload.username}, function(err, user) {
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
}));

// 拷贝 https://www.npmjs.com/package/passport-jwt 中的代码：
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =  keys.secretOrKey;

module.exports = passport => {
    // 拷贝 https://www.npmjs.com/package/passport-jwt 中的代码：
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log(jwt_payload);
        User.findById(jwt_payload.id)
            .then(user => {
                if(user) {
                    // console.log("return user!!!");
                    return  done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
}

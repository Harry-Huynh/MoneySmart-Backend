// passport.js
const passport = require('passport');
const passportJWT = require('passport-jwt');

//JSON Web Token Setup
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

// Configure its options
let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    if (jwt_payload) {
      return done(null, {
        username: jwt_payload.username,
        userId: jwt_payload.id,
      });
    } else {
      done(null, false);
    }
  })
);

module.exports = { passport, jwtOptions };

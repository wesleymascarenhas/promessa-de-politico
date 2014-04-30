var FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy  = require('passport-twitter').Strategy,
    GoogleStrategy   = require('passport-google').Strategy,
    userService      = require('../apis/userService'),
    settings         = require('./settings');

exports.configure = function(app, passport) {
  console.log('Configuring authentication strategy');

  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    userService.findByID(id, function(err, user) {
      if(err) {
        done(err);
      }
      if(user) {
        done(null, user);
      }
    });
  });

  passport.use(new FacebookStrategy({ clientID: settings.facebook.clientID,
      clientSecret: settings.facebook.clientSecret,
      callbackURL: settings.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      userService.findByFacebookID(profile._json.id, function(err, user) {
        if(err) { return done(err); }
        if(!user) {
          user = userService.create(profile._json.name, profile._json.username, profile._json.email, profile._json.gender, profile._json.id, function(err, user) {
            if(err) { return done(err); }
            done(null, user);            
          });            
        }
      });
    }
  ));
}
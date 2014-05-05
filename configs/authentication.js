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
    userService.findByID(id)
    .then(function(user) {
      if(user) {
        return user;
      }   
      throw new Error("Error deserializing user with id " + id);    
    }).nodeify(done);
  });

  passport.use(new FacebookStrategy({ 
      clientID: settings.facebook.clientID,
      clientSecret: settings.facebook.clientSecret,
      callbackURL: settings.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      var profileInfos = profile._json;
      userService.findByFacebookAccount(profileInfos.id)
      .then(function(user) {
        if(user) {          
          return user; 
        }
        return userService.findByEmail(profileInfos.email)
        .then(function(user) {
          if(user) {
            user.set('facebook_account', profileInfos.id);
            return userService.update(user, ['facebook_account'])
            .then(function(user) {
              if(user) {
                return user;
              }
              throw new Error("Error associating existing account with Facebook");
            });
          } else {
            return userService.createByFacebookAccount(profileInfos.name, profileInfos.gender, profileInfos.username, profileInfos.email, profileInfos.id)
            .then(function(user) {
              if(user) {
                return user;
              }
              throw new Error("Error creating account associated with Facebook");
            });
          }
        });
      }).nodeify(done);
    }
  ));
}
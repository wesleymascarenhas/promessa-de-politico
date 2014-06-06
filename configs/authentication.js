var FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy  = require('passport-twitter').Strategy,
    GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy,
    userService      = require('../apis/userService'),
    fileUtils        = require('../utils/fileUtils'),
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
      throw new Error('Error deserializing user with id ' + id);    
    }).nodeify(done);
  });

  passport.use(new FacebookStrategy({ 
      clientID: settings.facebook.clientID,
      clientSecret: settings.facebook.clientSecret,
      callbackURL: settings.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      var profileInfos = profile._json;
      userService.findByFacebookAccount(profileInfos.id).then(function(user) {
        if(user) {          
          console.log(profile)
          return fileUtils.downloadUserPhoto('https://graph.facebook.com/' + profileInfos.username + '/picture?width=200&height=200&access_token=' + accessToken, user, function(err) {
                  if(!err) {
                    userService.update(user, ['photo_filename']).then(function(user) {});
                  }
                  return user;                    
                });
          return user; 
        }
        userService.findByEmail(profileInfos.email).then(function(user) {
          if(user) {
            user.set('facebook_account', profileInfos.id);
            userService.update(user, ['facebook_account']).then(function(user) {
              if(user) {
                return user;
              }
              throw new Error('Error associating existing account with Facebook');
            });
          } else {           
            userService.createByFacebookAccount(profileInfos.name, profileInfos.gender, profileInfos.username, profileInfos.email, profileInfos.id).then(function(user) {
              if(user) {
                
              }
              throw new Error('Error creating account associated with Facebook');
            });
          }
        });
      }).nodeify(done);
    }
  ));

  passport.use(new TwitterStrategy({ 
      consumerKey: settings.twitter.clientID,
      consumerSecret: settings.twitter.clientSecret,
      callbackURL: settings.twitter.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      var profileInfos = profile._json;
      userService.findByTwitterAccount(profileInfos.id).then(function(user) {
        if(user) {          
          return user; 
        }
        userService.createByTwitterAccount(profileInfos.name, profileInfos.gender, profileInfos.username, null, profileInfos.id).then(function(user) {
          if(user) {
            return user;
          }
          throw new Error('Error creating account associated with Twitter');
        });
      }).nodeify(done);
    }
  ));

  passport.use(new GoogleStrategy({ 
      clientID: settings.google.clientID,
      clientSecret: settings.google.clientSecret,
      callbackURL: settings.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      var profileInfos = profile._json;
      userService.findByGoogleAccount(profileInfos.id).then(function(user) {
        if(user) {          
          return user; 
        }
        userService.findByEmail(profileInfos.email).then(function(user) {
          if(user) {
            user.set('google_account', profileInfos.id);
            userService.update(user, ['google_account']).then(function(user) {
              if(user) {
                return user;
              }
              throw new Error('Error associating existing account with Google');
            });
          } else {
            userService.createByGoogleAccount(profileInfos.name, null, null, profileInfos.email, profileInfos.id).then(function(user) {
              if(user) {
                return user;
              }
              throw new Error('Error creating account associated with Google');
            });
          }
        });
      }).nodeify(done);
    }
  ));
}
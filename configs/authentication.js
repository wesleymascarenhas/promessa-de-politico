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
      var profileInfos = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        username: profile.username,
        gender: profile.gender, 
        picture: 'https://graph.facebook.com/' + profile.id + '/picture?width=40&height=40&access_token=' + accessToken
      };
      userService.findByFacebookAccount(profileInfos.id).then(function(user) {
        if(user) {                    
          return user; 
        }
        userService.findByEmail(profileInfos.email).then(function(user) {
          if(user) {
            user.set('facebook_account', profileInfos.id);
            userService.update(user, ['facebook_account']).then(function(user) {
              return user;
            }).catch(function(err) {
              return new Error('Error associating existing account with Facebook');
            });
          } else {           
            userService.createByFacebookAccount(profileInfos.name, profileInfos.gender, profileInfos.username, profileInfos.email, profileInfos.id).then(function(user) {            
              return fileUtils.downloadUserPhoto(profileInfos.picture, user);
            }).then(function(user) {
              return userService.update(user, ['photo_filename']);
            }).then(function(user) {
              return user;                                                      
            }).catch(function(err) {
              console.log(err)
              return new Error('Error creating account associated with Facebook');             
            });
          }
        }).catch(function(err) {
          return new Error('Error creating account associated with Facebook');
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
      var profileInfos = {
        id: profile.id,
        email: null,
        name: profile.displayName,
        username: profile.username,
        gender: null, 
        picture: profile.photos[0].value
      };
      userService.findByTwitterAccount(profileInfos.id).then(function(user) {
        if(user) {          
          return user; 
        }
        userService.createByTwitterAccount(profileInfos.name, profileInfos.gender, profileInfos.username, profileInfos.email, profileInfos.id).then(function(user) {            
          return fileUtils.downloadUserPhoto(profileInfos.picture, user);
        }).then(function(user) {
          return userService.update(user, ['photo_filename']);
        }).then(function(user) {
          return user;                                                      
        }).catch(function(err) {
          console.log(err.stack)
          return new Error('Error creating account associated with Twitter');             
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
      var profileInfos = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        username: profile.emails[0].value.split('@')[0],
        gender: profile._json.gender, 
        picture: profile._json.picture
      };
      userService.findByGoogleAccount(profileInfos.id).then(function(user) {
        if(user) {                    
          return user; 
        }
        userService.findByEmail(profileInfos.email).then(function(user) {
          if(user) {
            user.set('google_account', profileInfos.id);
            userService.update(user, ['google_account']).then(function(user) {
              return user;
            }).catch(function(err) {
              return new Error('Error associating existing account with Google');
            });
          } else {           
            userService.createByGoogleAccount(profileInfos.name, profileInfos.gender, profileInfos.username, profileInfos.email, profileInfos.id).then(function(user) {            
              return fileUtils.downloadUserPhoto(profileInfos.picture, user);
            }).then(function(user) {
              return userService.update(user, ['photo_filename']);
            }).then(function(user) {
              return user;                                                      
            }).catch(function(err) {
              console.log(err)
              return new Error('Error creating account associated with Google');             
            });
          }
        }).catch(function(err) {
          return new Error('Error creating account associated with Google');
        });
      }).nodeify(done);
    }
  ));
}
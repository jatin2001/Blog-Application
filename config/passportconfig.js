const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../model/User');

module.exports = function(passport)
{
    passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
        User.findOne({email},(err,user)=>{
            if(err) console.log(err);
            else{
                if(!user)
                {
                    return done(null,false,{message:'That email is not registered'})
                }
                else{
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(!isMatch)
                        {
                            return done(null,false,{message:'Password incorrect'})
                        }
                        else{
                            return done(null,user);
                        }
                    })
                }
            }
        })
    }))
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

      //using google stratergy
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://aqueous-gorge-92975.herokuapp.com/auth/google/dashboard",
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOne({
            email: profile.emails[0].value
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    name: profile.displayName,   
                    email:profile.emails[0].value, 
                    googleId:profile.id,    
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
      }));

    //USing facebook Stratergy
    
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://aqueous-gorge-92975.herokuapp.com/auth/facebook/dashboard",
    profileFields: ['id', 'displayName', 'emails', 'photos','profileUrl'],
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
        facebookId:profile.id
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
            user = new User({
                facebookId:profile.id,
                name:profile.displayName,
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //found user. Return
            return done(err, user);
        }
    });
  }
));
}
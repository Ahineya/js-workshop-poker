var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./User.js');

module.exports = {
    Facebook: function(config) {
        return new FacebookStrategy({
                clientID: config.get('app.oauth.facebook.clientID'),
                clientSecret: config.get('app.oauth.facebook.clientSecret'),
                callbackURL: config.get('app.oauth.facebook.callbackURL')
            },
            function (accessToken, refreshToken, profile, done) {
                User.findOne({ oauthID: profile.id }, function (err, user) {
                    if (err) {
                        console.log(err);
                    }
                    if (!err && user != null) {
                        done(null, user);
                    } else {
                        user = new User({
                            oauthID: profile.id,
                            name: profile.displayName,
                            created: Date.now(),
                            coins: 1000
                        });
                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("saving user ...");
                                done(null, user);
                            }
                        });
                    }
                });
            }
        )
    }
};
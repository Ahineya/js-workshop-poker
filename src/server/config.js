var config = {
    oauth: {
        facebook: {
            clientID: '1473170869614770',
            clientSecret: '4e5a8216854bb3ed0d2546e647cac37e',
            callbackURL: 'http://local.foo.com:8080/auth/facebook/callback'
        },
        twitter: {
            consumerKey: 'get_your_own',
            consumerSecret: 'get_your_own',
            callbackURL: "http://127.0.0.1/auth/twitter/callback"
        },
        github: {
            clientID: 'get_your_own',
            clientSecret: 'get_your_own',
            callbackURL: "http://127.0.0.1/auth/github/callback"
        },
        google: {
            returnURL: 'http://127.0.0.1/auth/google/callback',
            realm: 'http://127.0.0.1:1337'
        }
    }

};

module.exports = config;
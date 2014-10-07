module.exports = function(app, passport, User) {
    app.get('/', function(req, res){
        var data = {};
        if (req.isAuthenticated()) {
            res.redirect('/game');
        }
        res.render('index');
    });

    app.get('/auth', function(req, res) {
        res.render('auth');
    });

    app.get('/game', ensureAuthenticated, function(req, res){
        User.findById(req.session.passport.user, function(err, user) {
            if(err) {
                console.log(err);
            } else {
                res.render('game', { user: user});
            }
        });
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook'),
        function(req, res){
        });

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        function(req, res) {
            res.redirect('/game');
        });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/');
    }
};
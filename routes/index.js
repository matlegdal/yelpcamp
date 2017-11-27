var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");


// INDEX - Landing page
router.get("/", function(req, res) {
    res.render("landing");
});

// =========================
//  AUTHENTIFICATION ROUTES
// =========================

// INDEX - show the form to register a new user
router.get("/register", function(req, res) {
    res.render("register");
});

// CREATE - register a user and redirect
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username + " !");
            res.redirect("/campgrounds");
        });
    });
});

// INDEX - show the form to login
router.get("/login", function(req, res) {
    res.render("login");
});

// CREATE - verify login authorization and redirect
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

// INDEX - logout and redirect
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;
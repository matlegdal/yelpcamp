var Campground = require("../models/campground"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to add campgrounds and comments");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
// is user logged in?
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if (err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // does the user own the campground?
                if (campground.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "Permission denied. You can only edit campgrounds that you created.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to edit campgrounds.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
// is user logged in?
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if (err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // does the user own the comment?
                if (comment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "Permission denied. You can only edit comments that you created.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to edit comments.");
        res.redirect("back");
    }
}

module.exports = middlewareObj;
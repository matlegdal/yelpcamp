var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

// NEW - show the form to add a comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE - add new comment to db and redirect to campground show page
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", "Campground not found.");
            res.redirect("/campgrouds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    req.flash("error", "Oops! Something went wrong!");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Your comment was successfully added!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

// EDIT - show a form to edit the comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if (err) {
            req.flash("error", "Comment not found.");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    });
});

// UPDATE - find and update a comment and redirect to /campgrounds/:id
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            req.flash("error", "Comment not found.");
            res.redirect("back");
        } else {
            req.flash("success", "Your comment was successfully edited!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - find and remove a comment and redirect to campgrounds/:id
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            req.flash("error", "Comment not found.");
            res.redirect("back");
        } else {
            req.flash("success", "Your comment was successfully deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
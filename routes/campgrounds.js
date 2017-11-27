var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");


// INDEX - Show all campgrounds
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
            req.flash("error", "Campgrounds not found.");
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE - Add a new campground to db and redirect to /campgrounds 
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    }
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            req.flash("error", "Error. The campground could not be created.");
        } else {
            req.flash("success", "Campground successfully created!");
            res.redirect("/campgrounds");
         }
    });
});

// NEW - Show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - Show more info on 1 campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if (err) {
            req.flash("error", "Error. The campground could not be found.");
        } else {
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT - Show the form to edit a campgroud
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            req.flash("error", "Error. The campground could not be found.");
        }
        res.render("campgrounds/edit", {campground: campground});
    });
});

// UPDATE - find and update the campground and redirect to the show page
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            req.flash("error", "Error. The campground could not be found.");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully edited!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - find and delete the campground and redirect to /campgrounds
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            req.flash("error", "Error. The campground could not be found.");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully deleted!");
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;
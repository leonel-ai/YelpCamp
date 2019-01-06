var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


// INDEX = SHOW ALL CAMPGROUNDS
router.get("/", function(req, res) {
  // get all campgrounds from DB then render file
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
    }
  });
});

// CREATE = ADD NEW CAMPGROUND TO DB
router.post("/", function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  // create new campground and save to db
  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

// NEW = SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", function(req, res) {
  res.render("campgrounds/new");
});

// SHOW = SHOWS MORE INFO ABOUT 1 CAMPGROUND
router.get("/:id", function(req, res){
  // find campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err) {
      console.log(err);
    } else {
      // render SHOW template with given ID
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

module.exports = router;
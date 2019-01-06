var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB(); // add in sample data

app.get("/", function(req, res){
  res.render("landing");
});

// INDEX = SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res) {
  // get all campgrounds from DB then render file
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

// CREATE = ADD NEW CAMPGROUND TO DB
app.post("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

// SHOW = SHOWS MORE INFO ABOUT 1 CAMPGROUND
app.get("/campgrounds/:id", function(req, res){
  // find campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err) {
      console.log(err);
    } else {
      // render SHOW template with given ID
      res.render("show", {campground: foundCampground});
    }
  });
});


// START EXPRESS SERVER
app.listen(5500, 'localhost', function() {
  console.log("YelpCamp server has started!");
});
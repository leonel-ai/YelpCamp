var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name: "Salmon Creek",
//   image: "https://images.unsplash.com/photo-1532775946639-ebb276eb9a1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
// }, function(err, campground) {
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Newly created campground!");
//     console.log(campground);
//   }
// });

// var campgrounds = [
  // {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1532775946639-ebb276eb9a1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"},
//   {name: "Bear Hill", image: "https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/munmorah-state-conservation-area/background/freemans-campground-background.jpg"},
//   {name: "Jones Park", image: "https://images.unsplash.com/photo-1540170690617-c5cf401fc763?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}
// ];

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  // get all campgrounds from DB then render file
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds", {campgrounds: allCampgrounds});
    }
  });
});

app.post("/campgrounds", function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
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

app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

app.listen(5500, 'localhost', function() {
  console.log("YelpCamp server has started!");
});
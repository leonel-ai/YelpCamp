var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user");
    seedDB        = require("./seeds");

mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // conventional
seedDB(); // add in sample data

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "thank you next",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// own middleware
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// =============
// ROUTES
// =============

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
      res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
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
  res.render("campgrounds/new");
});

// SHOW = SHOWS MORE INFO ABOUT 1 CAMPGROUND
app.get("/campgrounds/:id", function(req, res){
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

// ===========
// COMMENTS ROUTES
// ===========

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  // find camground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground})
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // redirect campground show page
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  });
})

// ===========
// AUTH ROUTES
// ===========

// show register form
app.get("/register", function(req, res){
  res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      return res.render("register");
    }
    // log the user in
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// show login form
app.get("/login", function(req, res){
  res.render("login");
});

// handle login logic
app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
  }), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

// middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

// START EXPRESS SERVER
app.listen(5500, 'localhost', function() {
  console.log("YelpCamp server has started!");
});
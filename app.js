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

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // conventional
// seedDB(); // seed the database

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

// topics will start with first arg
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// START EXPRESS SERVER
app.listen(5500, 'localhost', function() {
  console.log("YelpCamp server has started!");
});
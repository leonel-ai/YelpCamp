var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOver    = require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user");
    seedDB        = require("./seeds");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

// local dev use - mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser: true})
mongoose.connect("mongodb://leonela:Testcase1@ds151994.mlab.com:51994/yelpcamp-lg", {useNewUrlParser: true})
  .then(() => {
    console.log("Connected to Database");
  }).catch((err) => {
    console.log("ERROR: Not Connected to Database", err);
  });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // conventional
app.use(methodOver("_method"));
app.use(flash());
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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// topics will start with first arg
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// START EXPRESS SERVER
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("YelpCamp server has started!");
});
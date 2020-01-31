var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    seedDB = require("./seeds");

// requiring models
var Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");

// requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// require is saving contents of package into variable, then execute variable with .use
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(flash());
//serving stylesheet publicly. dirname is directory app.js running in.
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//seedDB(); //seed the database

//PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "This sentence can be anything!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


// see cammpgrounds - can specify route to cut down code in route files
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// seed data method 1 (2nd is via the models)
/* 
Campground.create({
       name:"Clifden Eco-beach Camping",
       image:"https://www.mykidstime.com/wp-content/uploads/2018/05/Clifden-Eco-Beach-Campsites-in-Ireland.jpg",
       description: "This is a lovely campsite. It has bathroom and nice views and is eco!"
        },function(err,campground){
        if(err){
            console.log(err);
         }
        else{
            console.log("NEWLY CREATED CAMPGROUND");
            console.log(campground);
        }
});

*/

// use port 5000 unless there exists a preconfigured port
var port = process.env.port || 5000;

app.listen(port, function () {
    console.log("app is listening on port:" + port);
});

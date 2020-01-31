var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// root route
router.get("/", function (req, res) {
    //res.send("This will be the landing page soon");
    res.render("landing");
})

//show register form
router.get("/register", function (req, res) {
    res.render("register");
})

//handle signup logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message) //passport includes message for error eg password can't be blank
            return res.render("register");
        }
        // if new user creation worked, then log them in
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect("/campgrounds");
        })
    })
})

//show login form
router.get("/login", function (req, res) {
    res.render("login");
})

//handle login logic with middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
});

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds");
})


module.exports = router;
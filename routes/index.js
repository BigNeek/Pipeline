var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res) {
    res.redirect("/login");
});

// REGISTER ROUTES
router.get("/register", function(req,res) {
    res.render("register");
});

router.post("/register", function(req, res) {
   User.register({username: req.body.username}, req.body.password, function(err, user) {
       if(err) {
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Pipeline, " + user.username + ". Add a requisition and start tracking your candidates!");
            res.redirect("/reqs");
       })
   }); 
});

// LOGIN ROUTES
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/reqs",
    failureRedirect: "/login"
}), function(req, res) {
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/");
});

module.exports = router;
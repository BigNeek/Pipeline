var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/archive", function(req, res) {
    User.findById(req.user.id).populate("requisitions").exec(function(err, user) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            console.log(user);
            res.render("archive", {user: user});
        }
    });
})

module.exports = router;
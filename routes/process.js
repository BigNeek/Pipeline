var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/process", middleware.isLoggedIn, function(req, res) {
    // THIS USES "DEEP POPULATION TO POPULATE REQUISITIONS WITHIN USER SCHEMA AND CANDIDATES WITHIN REQUISITION SCHEMA"
    User.findById(req.user.id).populate({
        path: 'requisitions',
        model: 'Requisition',
        populate: {
            path: 'candidates',
            model: 'Candidate'
        }
    }).exec(function(err, user) {
        if(err) {
            res.redirect("back");
            console.log(err);
        } else {
            res.render("process", {user: user});
        }
    });
});


module.exports = router;
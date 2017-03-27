var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Requisition = require("../models/requisition");
var middleware = require("../middleware");


// OPEN REQ PAGE AND USE DEEP POPULATION TO POPULATE REQUISITIONS WITHIN USER SCHEMA AND CANDIDATES WITHIN REQUSITION SCHEMA
router.get("/reqs", middleware.isLoggedIn, function(req, res) {
    User.findById(req.user.id).populate({
        path: 'requisitions',
        model: 'Requisition',
        populate: {
            path: 'candidates',
            model: 'Candidate'
        }
        }).exec(function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {user: user});
        }
    });
});

// CREATE NEW REQ
router.post("/reqs", middleware.isLoggedIn, function(req, res) {
    User.findById(req.user.id, function(err, user) {
        if(err) {
            console.log(err)
            res.redirect("/reqs");
        } else {
            Requisition.create(req.body, function(err, role) {
                if(err) {
                    console.log(err);
                    res.redirect("/reqs");
                } else {
                    // ONCE NEW REQ IS CREATED IT IS PUSHED INTO USER.REQUISITIONS ARRAY AND THEN THE USER IS SAVED
                    user.requisitions.push(role);
                    user.save();
                    res.send(role);
                }
            });
        }
    });
});

// EDIT REQ
router.put("/reqs/:id", middleware.isLoggedIn, function(req, res) {
    Requisition.findByIdAndUpdate(req.params.id, req.body, function(err, updated) {
        if(err) {
            res.redirect("back");
            console.log(err);
        } else {
            res.send(updated);
        }
    });
});

// REQ SHOW ROUTE
router.get("/reqs/:id", middleware.isLoggedIn, function(req, res) {
    Requisition.findById(req.params.id).populate("candidates").exec(function(err, req) {
        if(err) {
            res.redirect("back")
            console.log(err);
        } else {
            res.render("show", {req: req});
        }
    });
});

// REQ DELETE ROUTE
router.delete("/reqs/:id", middleware.isLoggedIn, function(req, res) {
    Requisition.findByIdAndRemove(req.params.id, function(err, deleted) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            // WHEN A REQUISITON IS DELETED THIS .UPDATE MONGOOSE METHOD DELETED THE ORPHANED REQUISITION IDS FROM USER SCHEMA
            User.update({_id: deleted.user},
                {$pull: {requisitions: deleted._id}},
                function(err, numberAffected) {
                    if(err) {
                        console.log(err);
                    } else {
                        
                    }
                }
            );
            req.flash("error", "Req deleted.");
            res.send(deleted);
        }
    });
});

module.exports = router;
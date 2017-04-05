var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");

router.put("/todo", function(req, res) {
    User.findByIdAndUpdate(req.user.id, {$push: {"todos": req.body}}, { 'new': true}, function(err, updated) {
        if(err) {
            res.redirect("back");
            console.log(err);
        } else {
            res.send(updated);
        }
    });
});

router.delete("/todo/:id", function(req, res) {
    User.update({_id: req.user.id}, {$pull: {todos: {_id: req.params.id}}}, function(err, updated) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.send(updated);
        }
    });
});



module.exports = router;
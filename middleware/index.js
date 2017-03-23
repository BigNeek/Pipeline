var User = require("../models/user"),
    Requisition = require("../models/requisition"),
    Candidate = require("../models/candidate");
    
var middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObject
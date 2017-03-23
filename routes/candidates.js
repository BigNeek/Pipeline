var express = require("express");
var router = express.Router();
var Requisition = require("../models/requisition");
var Candidate = require("../models/candidate");
var middleware = require("../middleware");

// CREATE NEW CANDIDATE
router.post("/reqs/:id/candidates", middleware.isLoggedIn, function(req, res) {
    Requisition.findById(req.params.id, function(err, requisition) {
      if(err) {
          console.log(err);
          res.redirect("back");
      } else {
          Candidate.create(req.body, function(err, candidate) {
              if(err) {
                  console.log(err);
                  res.redirect("back")
              } else {
                //   ONCE NEW CANDIDATE IS CREATED, IT IS PUSHED INTO REQUISITION.CANDIDATES AND THEN SAVED
                  requisition.candidates.push(candidate);
                  requisition.save();
                  res.send(candidate);
              }
          });
      }
    });
});

// DELETE CANDIDATE
router.delete("/reqs/:id/candidates/:candidate_id", middleware.isLoggedIn, function(req, res) {
    Candidate.findByIdAndRemove(req.params.candidate_id, function(err, deleted) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } 
        else {
            // THIS FINDS THE ASSOCIATED REQ THAT IS REFERENCING THE CANDIDATE THAT WAS JUST DELETED AND DELETES THE REFERENCE TO THE DELETED CANDIDATE FROM THAT REQ
            Requisition.update({_id: deleted.requisition},
                {$pull: {candidates: deleted._id}},
                function(err, numberAffected) {
                    if(err) {
                        console.log(err);
                    } else {
                        res.send(deleted);
                    }
                }
            );
        }
    });
});

// EDIT CANDIDATE
router.put("/reqs/:id/candidates/:candidate_id", middleware.isLoggedIn, function(req, res) {
    Candidate.findByIdAndUpdate(req.params.candidate_id, req.body, function(err, updated) {
        if(err) {
            console.log(err);
        } else {
            res.send(updated);
        }
    });
});



module.exports = router;
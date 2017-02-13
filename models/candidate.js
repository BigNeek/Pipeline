var mongoose = require("mongoose");

var CandidateSchema = new mongoose.Schema({
    name: String,
    contact2: false,
    contact3: false,
    response: String
});

module.exports = mongoose.model("Candidate", CandidateSchema);
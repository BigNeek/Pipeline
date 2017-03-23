var mongoose = require("mongoose");

var candidateSchema = new mongoose.Schema({
    name: String,
    contact2: false,
    contact3: false,
    response: String,
    process: String,
    note: String,
    requisition: mongoose.SchemaTypes.ObjectId
});

// TRYING TO FIGURE OUT HOW TO MAKE THIS MIDDLEWARE WORK THAT IS SUPPOSED TO CLEAN UP MY REQUISITION.CANDIDATES ARRAY
// candidateSchema.pre("update", function(next) {
//     this.model("Requisition").update(
//         { },
//         { "$pull": {"candidates": this._id} },
//         { "multi": true },
//         next()
//     );
// });

module.exports = mongoose.model("Candidate", candidateSchema);
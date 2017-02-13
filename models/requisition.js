var mongoose = require("mongoose");

var RequisitionSchema = new mongoose.Schema({
    role: String,
    candidates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate"
        }
    ]
});

module.exports = mongoose.model("Requisition", RequisitionSchema);
var mongoose = require("mongoose");


var requisitionSchema = new mongoose.Schema({
    role: String,
    candidates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Candidate"
            }
        ],
    user: mongoose.SchemaTypes.ObjectId,
    archive: String
});

module.exports = mongoose.model("Requisition", requisitionSchema);
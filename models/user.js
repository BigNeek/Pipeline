var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    requisitions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Requisition"
     }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
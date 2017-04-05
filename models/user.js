var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var todoSchema = new mongoose.Schema({
    created: { type: Date, default: Date.now },
    todo: String
});

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
    ],
    todos: [todoSchema]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
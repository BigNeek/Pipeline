var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Requisition = require("./models/requisition"),
    Candidate = require("./models/candidate");
    
mongoose.connect("mongodb://localhost/pipeline");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "that dude neek is the man",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Adding user information to each route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/pipeline", function(req, res) {
    User.findById(req.user.id).populate("requisitions").exec(function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render("pipeline", {user: user});
        }
    });
});

app.post("/pipeline", function(req, res) {
    User.findById(req.user.id, function(err, user) {
        if(err) {
            console.log(err)
            res.redirect("/pipeline");
        } else {
            Requisition.create({role: req.body.requisition}, function(err, role) {
                if(err) {
                    console.log(err);
                    res.redirect("/pipeline");
                } else {
                    user.requisitions.push(role);
                    user.save();
                    res.redirect("/pipeline");
                }
            });
        }
    });
});

// REGISTER ROUTES
app.get("/register", function(req,res) {
    res.render("register");
});

app.post("/register", function(req, res) {
   User.register({username: req.body.username}, req.body.password, function(err, user) {
       if(err) {
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function() {
            res.redirect("/pipeline");
       })
   }); 
});

// LOGIN ROUTES
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/pipeline",
    failureRedirect: "/login"
}), function(req, res) {
});

// LOGOUT ROUTE
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("We're online!!!")
});
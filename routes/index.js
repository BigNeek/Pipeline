var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var asink = require("async");
var crypto = require("crypto");
var nodemailer = require("nodemailer");

router.get("/", function(req, res) {
    res.redirect("/login");
});

// REGISTER ROUTES
router.get("/register", function(req,res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    if(req.body.password === req.body.confirm) {
        User.register({username: req.body.username, email: req.body.username}, req.body.password, function(err, user) {
           if(err) {
               console.log(err);
               return res.render("register");
           }
           passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to Pipeline! Add a requisition and start tracking your candidates.");
                res.redirect("/reqs");
           });
       }); 
    } else {
        req.flash("error", "Your passwords did not match.");
        res.redirect("back");
    }
});

// LOGIN ROUTES
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/reqs",
    failureRedirect: "/login"
}), function(req, res) {
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/");
});

// FORGOT ROUTE
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

// RESET PASSWORD EMAIL ROUTE

router.post('/forgot', function(req, res, next) {
  asink.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nfoti201@gmail.com",
          pass: "yahret101"
        }
      });
      var mailOptions = {
        to: user.email,
        from: user,
        subject: 'Pipeline Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});


// RESET PASSWORD PAGE

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {user: user});
  });
});


// RESETS PASSWORD IN THE DATABASE AND SENDS EMAIL TO CONFIRM

router.post('/reset/:token', function(req, res) {
  asink.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.setPassword(req.body.password, function() {
            user.save();
        }); 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nfoti201@gmail.com',
          pass: 'yahret101'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/reqs');
  });
});

module.exports = router;
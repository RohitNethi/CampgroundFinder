var express     = require('express'),
    passport    = require('passport'),
    router      = express.Router(),
    User        = require('../models/user');
//====================
//Adding Auth Routes
//====================

// Root route
router.get("/",function(req,res){
    res.render("landing");
});

//show register form
router.get("/register", function(req,res){
   res.render("register"); 
});

//Signup route
router.post("/register", function(req,res){
    var newUser  = new User({username: req.body.username});
    var password = req.body.password;
    User.register(newUser, password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res, function(){
        req.flash("success", "Registered Successfully!");
        res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req,res){
    res.render("login");
});

//Login post route
router.post("/login", passport.authenticate("local", 
    {   
        failureRedirect: "/login",
        failureFlash: true
    }), function(req,res){
        req.flash("success", "Welcome " + req.user.username +"!");
        res.redirect("/campgrounds");
    
});

//Logout Route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success","Successfully logged out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error", "Login first!");
        res.redirect("/login");
    }
}

module.exports = router;
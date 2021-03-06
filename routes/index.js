var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware")

//root route
router.get("/",function(req,res){
    res.render("landing");
})

//register route
router.get("/register",function(req,res){
    res.render("register");
})

//register post
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        } 
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Yelp Camp " + user.username);
            res.redirect("/campgrounds");
        });
    });
})

//login route
router.get("/login",function(req,res){
    res.render("login");
});

//login post
router.post("/login",passport.authenticate("local",    
    {
    successRedirect: "/campgrounds",
    successFlash: "Welcome Back! ",
    failureRedirect: "/login"
    }) ,function(req, res){
});

//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
})

module.exports = router;
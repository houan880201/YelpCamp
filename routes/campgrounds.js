var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var Comment = require("../models/comment")

//root route
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser: req.user});
        }
    })
})

//Create Route
router.post("/", isLoggedIn,function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var dsc = req.body.description;
    var author ={
        id: req.user._id,
        username:  req.user.username
    }
    var newCampground = {name: name, image: image, description: dsc,author: author}
    Campground.create(newCampground,function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//New Route
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
})

//Show Route
router.get("/:id", function(req,res){
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       } else {
           console.log(foundCampground);
           res.render("campgrounds/show",{campground: foundCampground});
       }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
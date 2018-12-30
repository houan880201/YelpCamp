var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "cloud",
        image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
        description: "Colt will show you how to remedy this issue by making a reference to the Comment model from within the Campground model. Just be sure to complete the Comment Model lecture and you won't have any issues."
    },
    {
        name: "sun",
        image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
        description: "Colt will show you how to remedy this issue by making a reference to the Comment model from within the Campground model. Just be sure to complete the Comment Model lecture and you won't have any issues."
    },
    {
        name: "poop",
        image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
        description: "Colt will show you how to remedy this issue by making a reference to the Comment model from within the Campground model. Just be sure to complete the Comment Model lecture and you won't have any issues."
    }
]

function seedDB(){
    //Remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log("remove campgrounds");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campgrund");
                        Comment.create(
                            {
                                text: "this is great",
                                author: "yoyoman"
                            },function(err,comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment")
                                }                
                            });
                    }
                })
            })
    });
}

module.exports = seedDB;
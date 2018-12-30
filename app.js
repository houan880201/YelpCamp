var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment")
    seedDB      = require("./seeds"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    User        = require("./models/user");

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))

//Pastport config
app.use(require("express-session")({
    secret: "this is a secret message",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})

app.get("/",function(req,res){
    res.render("landing");
})


app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser: req.user});
        }
    })
})

//Create Route
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var dsc = req.body.description;
    var newCampground = {name: name, image: image, description: dsc}
    Campground.create(newCampground,function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//New Route
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
})

//Show Route
app.get("/campgrounds/:id", function(req,res){
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

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new",{campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

//=====================
//Auth Routes
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
})

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",    
    {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }) ,function(req, res){
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(8124, "127.0.0.1",function(){
    console.log("Server started");
});

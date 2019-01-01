var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment")
    seedDB      = require("./seeds"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride = require("method-override"),
    flash       = require("connect-flash"),
    User        = require("./models/user");

    //require routes
    var commentRoutes = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes = require("./routes/index")

//seedDB();
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);

//app.listen(8124, "127.0.0.1",function(){
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Server started");
});




//Setup
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    flash           = require('connect-flash'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    User            = require('./models/user'),
    seedDB          = require('./seeds');

//seedDB(); 
console.log("pushing to ")

//Passport Configuration
app.use(require('express-session')({
    secret : "This is the secret to getting a job",
    resave : false,
    saveUninitialized : false
}));

app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://rohitnethi:webdevmaster@ds115446.mlab.com:15446/recipebook");
//mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("assets"));
app.use(flash());

app.use(function(req,res,next){
   res.locals.currentUser   = req.user;
   res.locals.error         = req.flash("error");
   res.locals.success       = req.flash("success");
   next();
});

//Routes
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

//Listen
app.listen(process.env.PORT,process.env.IP, function(){
    console.log("server has started");
})


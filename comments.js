// Create web server
// npm install express
// npm install body-parser
// npm install mongoose
// npm install ejs
// npm install express-sanitizer
// npm install method-override
// npm install express-session
// npm install passport
// npm install passport-local
// npm install passport-local-mongoose
// npm install connect-flash

// Import libraries
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var ejs = require("ejs");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var flash = require("connect-flash");

// Create web server
var app = express();

// Set up database
mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true, useUnifiedTopology: true });

// Set up schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Set up schema
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", userSchema);

// Set up passport
app.use(require("express-session")({
    secret: "This is a secret.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up ejs
app.set("view engine", "ejs");

// Set up body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Set up express-sanitizer
app.use(expressSanitizer());

// Set up method-override
app.use(methodOverride("_method"));

// Set up connect-flash
app.use(flash());

// Set up middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Set up routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs
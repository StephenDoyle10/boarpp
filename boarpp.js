let port = process.env.PORT;
if(port==null||port==""){
	port=3000
}
const express = require("express");
const app = express();
const ejs = require ("ejs");
const mongoose = require("mongoose");
const expressSession= require("express-session");
const BlogPost = require('./models/blogpost.js');
const Reply = require('./models/reply.js');
const User= require("./models/user.js");


const loginUserController = require("./controllers/loginUser.js");
const pageNotFoundController = require("./controllers/pageNotFound.js");
const searchResultsController = require("./controllers/searchResults.js");
const newReplyController = require("./controllers/newReply.js");
const editPostController = require("./controllers/editPost.js");
const deletePostController = require("./controllers/deletePost.js");
const newPostController = require("./controllers/newPost.js");
const signS3Controller=require("./controllers/signS3.js");
const logOutController=require("./controllers/logOut.js");
const userPostsController=require("./controllers/userPosts.js");
const postIDController=require("./controllers/postID.js");
const aboutPageRouteController=require("./controllers/aboutPageRoute.js");
const homePageRouteController=require("./controllers/homePageRoute.js");
const registerController=require("./controllers/register.js");
const loginPageRouteController=require("./controllers/loginPageRoute.js");
const signUpPageRouteController=require("./controllers/signUpPageRoute.js");


const bcrypt = require("bcrypt");
const path = require("path");
const fileUpload = require('express-fileupload');
const flash= require('connect-flash');
const aws=require("aws-sdk");
aws.config.region = 'eu-west-2';
const S3_BUCKET = process.env.S3_BUCKET;
const fs = require("fs");

// Define a connection with mongoose.connect which takes in the parameter host and database name.
// In this case the name of the database is 'boarpp'.
// While connecting, MongoDB will automatically create this database for us if it does not already exist.
mongoose.connect('mongodb+srv://stephendoyle10:tinYRipples575@cluster0.nimhz.mongodb.net/boarpp',
	{useNewUrlParser:true, useUnifiedTopology: true });


app.use(fileUpload());




// We get form data for MongoDB from the browser via the request 'body' attribute.
// With the following code we parse incoming request bodies in a middleware and make the form data available under the req.body property.
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());


// express.static is a package shipped with Express that helps us serve static files.
// With express.static('public'), we specify that any request that asks for assets should get it from the 'public' directory. 
app.use(express.static('public'));


// With app.set('view engine', 'ejs') we tell Express to use EJS as our templating engine, 
// that any file ending in .ejs should be rendered with the EJS package.
// It will look for files in the views folder.
app.set('view engine', 'ejs');

// This registers the expressSession middleware in our app and pass in a configuration object with a value to secret property.
// Secret string is used by the express-session package to sign and encrypt the session ID cookie being shared with the browser.
// It can be set to anything you want.
app.use(expressSession({
	secret:'keyboard cat'
}));
app.use(flash());

app.use(async(req, res, next) =>{
    if (req.session.userId == undefined){
    	next();
		}   else{
		loggedInUserObj=await User.findById(req.session.userId);
		req.body.loggedInUser = loggedInUserObj.username;
        next();
    }
});

//login get
app.get("/auth/login", loginPageRouteController);

//register get
app.get("/auth/register", signUpPageRouteController);

//login post
app.post('/users/login', loginUserController);

//register post
app.post('/users/register', registerController);

//route to home page
app.get("/",homePageRouteController);

//route to about page
app.get("/about", aboutPageRouteController);

// creates each individual blog post in its own specific url when the post is clicked on from the feed.
app.get("/post/:id", postIDController);

//click on a username to be directed to another page that contains all that user's posts
app.get("/user/:user", userPostsController);

//logout
app.get("/auth/logout", logOutController);

//submit a new post
app.post('/posts/store', newPostController);

//send picture to amazon s3 storage
app.get('/sign-s3', signS3Controller);

//delete post
app.post('/posts/delete', deletePostController);

//edit post
app.post('/posts/edit', editPostController);

//submit a reply/comment to a post
app.post('/posts/reply', newReplyController);

//search all posts for a particular keyword
app.post('/search', searchResultsController);

// With this middleware-like route, Express will go through all the routes 
// and if it cannot find one that matches, it will rended pagenotfound.
app.use(pageNotFoundController);


app.listen(port);
console.log(`server listening on port ${port}`);

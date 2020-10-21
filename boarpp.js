const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const ejs = require ("ejs");
const mongoose = require("mongoose");
const expressSession= require("express-session");
const BlogPost = require('./models/blogpost.js');
const User= require("./models/user.js");
const loginUserController = require("./controllers/loginUser.js")
const bcrypt = require("bcrypt");

// Define a connection with mongoose.connect which takes in the parameter host and database name.
// In this case the name of the database is 'boarpp'.
// While connecting, MongoDB will automatically create this database for us if it does not already exist.
mongoose.connect('mongodb://localhost/boarpp',
	{useNewUrlParser:true, useUnifiedTopology: true });


// Greg Lim writes of the need of bodyparser, but this is now built into Node as of a recent Node update
/*
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
*/

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
}))

app.get("/auth/login", (req, res)=>{
	res.render('login')
});

app.get("/auth/register", (req, res)=>{
	res.render('register')
});

app.post('/users/login', loginUserController);

app.post('/users/register', (req,res, next)=>{
	User.create(req.body, (error, user)=>{
		if(error){
			return res.redirect('/auth/register');
		}
		else{
		const {username,password}= req.body;

	User.findOne({username:username}, (error, user)=>{
		if(user){
			bcrypt.compare(password, user.password, (error, same)=>{
				if(same){
					req.session.userId=user._id;
					
					res.redirect('/')
				}
				else{
					res.redirect('/auth/login')
				}
			})
		}
		else{res.redirect("/auth/login")
	}
	})
	};})
});


app.use((req, res, next) =>{
    if (req.session.userId == undefined){

        return res.render('landingpage');
    }   else{
        next();
    }
});



app.get("/",async (req, res)=>{
	
	const blogposts = await BlogPost.find({});
	console.log("not signed in")
	res.render('home',{
		blogposts
	});
});


app.get("/newpost", async(req, res)=>{
	if(req.session.userId){
		const blogposts = await BlogPost.find({});
	return res.render('home',{
		blogposts
	})

	}
	res.redirect('auth/login')
});






app.get("/search", (req, res)=>{
	res.render('search')
});


// creates each individual blog post in its own specific url when the post is clicked on from the feed.
app.get("/post/:id", async(req, res)=>{
	const blogpost = await BlogPost.findById(req.params.id);
	res.render('post',{
		blogpost
	});

});


app.post('/posts/store',(req,res)=>{
	BlogPost.create(req.body, (error, blogpost)=>{
	console.log(req.body);
	res.redirect('/');

});
});




app.post('/search', async (req, res)=>{

	// The following two line convert req.body.search into a regex expression so it can be used in the .find function that follows.
	// 'i' passed at the end of the RegExp argument informs program to ignore case sensitivity
	let stringToGoIntoTheRegex = req.body.search;
	let searchterm = new RegExp(stringToGoIntoTheRegex, 'i');
	
	
	const blogposts = await BlogPost.find({body:searchterm});
	res.render('searchresults',{
		blogposts
	});
});


/*app.post('/users/register', (req,res)=>{
	User.create(req.body, (error, user)=>{
		res.redirect('/newpost')
	})
});
*/


// With this middleware-like route, Express will go through all the routes 
// and if it cannot find one that matches, it will rended pagenotfound.
app.use((req, res)=>{
	res.render('pagenotfound')
});


app.listen(port);
console.log(`server listening on port ${port}`);






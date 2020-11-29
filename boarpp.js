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
const loginUserController = require("./controllers/loginUser.js")
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


app.get("/auth/login", (req, res)=>{
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	res.render('login', {
		loggedInUser, useridnumber
	})
});

app.get("/auth/register", (req, res)=>{
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	res.render('register',{useridnumber, loggedInUser,
		errors:req.session.validationErrors
		//errors:flash('validationErrors')
	})
});

app.post('/users/login', loginUserController);

app.post('/users/register', (req,res, next)=>{
	User.create(req.body, (error, user)=>{
		if(error){
			
			const validationErrors = Object.keys(error.errors).map(key=>error.errors[key].message);
			req.session.validationErrors=validationErrors;
			//req.flash('validationErrors', validationErrors);
			
			return res.redirect('/auth/register');
		}
		else{req.session.userId=user._id;
			res.redirect('/')
	}})
});





app.get("/",async (req, res)=>{
	const replies = await Reply.find({});
	const blogposts = await BlogPost.find({}).populate('userid');
	
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	console.log(useridnumber);

	
	res.render('home',{
		blogposts, replies, useridnumber, loggedInUser
	});
});


app.get("/about", (req, res)=>{
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	res.render('about', {
		loggedInUser, useridnumber
	})
});

// creates each individual blog post in its own specific url when the post is clicked on from the feed.
app.get("/post/:id", async(req, res)=>{
	const blogposts = await BlogPost.find({_id:req.params.id}).populate('userid');
	console.log(blogposts.length);
	const replies = await Reply.find({});


	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	
	res.render('post',{
		blogposts, replies, useridnumber, loggedInUser
	});

});

app.get("/user/:user", async (req, res)=>{
	const blogposts = await BlogPost.find({userid:req.params.user}).populate('userid');
	const replies = await Reply.find({});
	const useridnumber=req.session.userId;
	
	const loggedInUser = req.body.loggedInUser;
	res.render('searchresults',{
		blogposts, replies, useridnumber, loggedInUser
	});
});


app.get('/practice', async(req,res)=>{
const replies = await Reply.find({});
	const blogposts = await BlogPost.find({}).populate('userid');
	
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	
	res.render('practice',{
		blogposts, replies, useridnumber, loggedInUser
	});
})

app.get("/auth/logout", (req, res)=>{
	req.session.destroy(()=>{
		res.redirect('/')
	})
})

app.post('/posts/store', async(req,res)=>{

	//if user did not upload a photo with post:
	if(!req.files||!req.files.image){
		await BlogPost.create({...req.body,userid:req.session.userId});
		console.log(req.body);
		res.redirect('/') 
		}

	//if user uploaded a photo with their post:
	else {
		let image = req.files.image;
		image.mv(path.resolve(__dirname, "public/img",image.name),async(error)=>{
		await BlogPost.create({...req.body, image:`https://boarpp.s3.eu-west-2.amazonaws.com/${req.files.image.name}`, userid:req.session.userId});
		res.redirect('/')
		});
		}
})


app.get('/sign-s3', (req, res) => {
	console.log("get signs3")
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
  	console.log("getsignedurl");
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});


app.post('/posts/delete', async(req, res)=>{
	
	await BlogPost.findByIdAndDelete(req.body.delete_post);

	res.redirect('/')
})

app.post('/posts/edit', async(req, res)=>{
	
	await BlogPost.findByIdAndUpdate(req.body.edit_post, {body:req.body.body})
	res.redirect('/')
})

app.post('/posts/reply', async(req,res)=>{
		await Reply.create({...req.body,userid:req.session.userId});
		console.log(req.body);

		//await BlogPost.create({...req.body,userid:req.session.userId});
		res.redirect('/') 
		
})

app.post('/search', async (req, res)=>{

	// The following two line convert req.body.search into a regex expression so it can be used in the .find function that follows.
	// 'i' passed at the end of the RegExp argument informs program to ignore case sensitivity
	let stringToGoIntoTheRegex = req.body.search;
	let searchterm = new RegExp(stringToGoIntoTheRegex, 'i');
	
	const replies = await Reply.find({});
	const blogposts = await BlogPost.find({body:searchterm}).populate('userid');
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	res.render('searchresults',{
		replies, blogposts, useridnumber, loggedInUser
	});
});



// With this middleware-like route, Express will go through all the routes 
// and if it cannot find one that matches, it will rended pagenotfound.


app.use((req, res)=>{
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	res.render('pagenotfound', {useridnumber, loggedInUser})
});


app.listen(port);
console.log(`server listening on port ${port}`);

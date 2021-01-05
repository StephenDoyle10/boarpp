const BlogPost = require('../models/blogpost.js');
const Reply = require('../models/reply.js');


module.exports=async (req, res)=>{
	const replies = await Reply.find({});
	const blogposts = await BlogPost.find({}).populate('userid');
	
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;

	
	res.render('home',{
		blogposts, replies, useridnumber, loggedInUser
	});
}
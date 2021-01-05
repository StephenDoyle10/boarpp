const BlogPost = require('../models/blogpost.js');
const Reply = require('../models/reply.js');




module.exports=async (req, res)=>{
	const blogposts = await BlogPost.find({userid:req.params.user}).populate('userid');
	const replies = await Reply.find({});
	const useridnumber=req.session.userId;
	
	const loggedInUser = req.body.loggedInUser;
	res.render('searchresults',{
		blogposts, replies, useridnumber, loggedInUser
	});
}
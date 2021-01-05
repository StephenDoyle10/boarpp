const BlogPost = require('../models/blogpost.js');
const Reply = require('../models/reply.js');

module.exports=async(req, res)=>{
	const blogposts = await BlogPost.find({_id:req.params.id}).populate('userid');
	const replies = await Reply.find({});


	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	
	res.render('post',{
		blogposts, replies, useridnumber, loggedInUser
	});

}
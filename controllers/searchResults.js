const Reply = require('../models/reply.js');
const BlogPost = require('../models/blogpost.js');

module.exports = async (req, res)=>{

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
}
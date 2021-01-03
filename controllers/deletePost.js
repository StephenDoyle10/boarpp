const BlogPost = require('../models/blogpost.js');

module.exports=async(req, res)=>{
	
	await BlogPost.findByIdAndDelete(req.body.delete_post);

	res.redirect('/')
}
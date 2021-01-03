const BlogPost = require('../models/blogpost.js');


module.exports = async(req, res)=>{
	
	await BlogPost.findByIdAndUpdate(req.body.edit_post, {body:req.body.body})
	res.redirect('/')
}
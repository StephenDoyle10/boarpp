const BlogPost = require('../models/blogpost.js');
const path = require("path");

module.exports=async(req,res)=>{

	//if user did not upload a photo with post:
	if(!req.files||!req.files.image){
		await BlogPost.create({...req.body,userid:req.session.userId});
		
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
}
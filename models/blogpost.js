const mongoose=require("mongoose");
const Schema = mongoose.Schema;


const BlogPostSchema=new Schema({
	body:String,
	username: String,
	datePosted:{
		type:Date,
		default:Date.now
	}
});
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports=BlogPost;
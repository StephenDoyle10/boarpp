const mongoose=require("mongoose");
const Schema = mongoose.Schema;


const ReplySchema=new Schema({
	reply:String,
	userid:{type:mongoose.Schema.Types.ObjectId,
		ref:'User',
		required:true

	},
	username:String,
	postid:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'BlogPost',
		required:true
	},
	datePosted:{
		type:Date,
		default:Date.now
	}
});
const Reply = mongoose.model('Reply', ReplySchema);
module.exports=Reply;
const Reply = require('../models/reply.js');


module.exports = async(req,res)=>{
		await Reply.create({...req.body,userid:req.session.userId});
		res.redirect('/') 
		
}
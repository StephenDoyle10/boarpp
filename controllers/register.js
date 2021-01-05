const User= require("../models/user.js");

module.exports=(req,res, next)=>{
	User.create(req.body, (error, user)=>{
		if(error){
			
			const validationErrors = Object.keys(error.errors).map(key=>error.errors[key].message);
			req.session.validationErrors=validationErrors;
			//req.flash('validationErrors', validationErrors);
			
			return res.redirect('/auth/register');
		}
		else{req.session.userId=user._id;
			res.redirect('/')
	}})
}
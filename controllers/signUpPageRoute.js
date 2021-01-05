module.exports=(req, res)=>{
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	res.render('register',{useridnumber, loggedInUser,
		errors:req.session.validationErrors
		//errors:flash('validationErrors')
	})
}
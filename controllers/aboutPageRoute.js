module.exports=(req, res)=>{
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	res.render('about', {
		loggedInUser, useridnumber
	})
}
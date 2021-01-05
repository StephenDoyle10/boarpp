
module.exports=(req, res)=>{
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	res.render('login', {
		loggedInUser, useridnumber
	})
}
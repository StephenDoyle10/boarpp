


module.exports = (req, res)=>{
	const useridnumber=req.session.userId;
	const loggedInUser = req.body.loggedInUser;
	res.render('pagenotfound', {useridnumber, loggedInUser})
}
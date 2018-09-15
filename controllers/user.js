var express= require('express');
var router= express.Router();

var passport=require('passport');
var User =require('../models/user');
// const redis=require('redis');

// let client=redis.createClient();

// client.on('connect',function(){
// 	console.log('connected to redis');
// });
var io = null
module.exports = function(ioInstance) {
					 io = ioInstance
					 return router;
	 }
// module.exports=router;

function isLoggedIn(req,res,next){
	if (req.isAuthenticated()) {
		return next();

	}
	res.redirect('/login');
}


router.get('/',function(req,res){
	res.render('signup');
});

router.get('/signup',function(req,res){
	res.render('signup');
});

router.post('/signup',passport.authenticate('local.signup',{
	successRedirect: '/profile',
	failureRedirect: '/signup',
	failureFlash : true
}));

router.get('/login',function(req,res){
	//console.log(req.user);
	login_error= req.flash('loginError')
	password_error= req.flash('passwordError')

	res.render('login',{loginError: login_error,passwordError: password_error});
});
router.post('/login',passport.authenticate('local.login',{
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash: true

}));


router.get('/profile',isLoggedIn,function(req,res){
	// console.log(req.user);
		// console.log('===========================================', req._passport.session);

	res.render('profile',{user: req.user,token : req.token,loginError: req.flash('loginError')});
});

router.get('/logout',function(req,res){
	console.log(req.user,"logged out");
	// client.set("user:"+user._id, 'offline');
	io.emit('user-logged-out', { user: req.user })
	req.logout();
	res.redirect('/');
});


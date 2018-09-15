var passport= require('passport');

var localStrategy=require('passport-local').Strategy;

var User =require('../models/user');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
const redis=require('redis');
let client=redis.createClient();

var io = null
module.exports = function(ioInstance) { io = ioInstance }

client.on('connect',function(){
	console.log('connected to redis');
});

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	User.findById(id,function(err,user){
			done(err,user);
	});
});

passport.use('local.signup', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},function(req,email,password,done){
	// console.log(User);
	User.findOne({'email': email},function(err,user){
		if(err){
			return done(err);
		}
		if(user){
			return done(null,false);
		}


		var newUser =new User();
		newUser.fullname= req.body.name;
		newUser.email= req.body.email;
		newUser.password= newUser.encryptPassword(req.body.password);

		newUser.save(function(err){
			if(err){
				return done(err);
			}
			// req.session.user = user;
			return done(null,newUser);
		})
	})
}));

passport.use('local.login', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},function(req,email,password,done){
	//console.log(email);
	User.findOne({'email': email},function(err,user){
		if(err){
			return done(err);
		}
		if(!user){
			
			return done(null, false, req.flash('loginError', 'No user found.'));
		}

		if(!user.validPassword(req.body.password)){
	
			 return done(null, false, req.flash('passwordError', 'Oops! Wrong password.')); 
			};
			// req.session.user = user;
			console.log(user,"user");
			// var token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
			// console.log("token: ", token);
			console.log(io,"io");
			io.emit('user-logged-in', { user: user })

			client.set("user:"+user._id, 'online');
			return done(null,user);
		 
	})
}));
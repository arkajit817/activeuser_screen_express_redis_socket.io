var express= require('express');
var path= require('path');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var session=require('express-session');
var mongoose=require('mongoose');
var passport=require('passport');
var MongoStore=require('connect-mongo')(session);
var flash=require('express-flash')
var user=require('./controllers/user');
var jwt = require('jsonwebtoken');

var socket = require('socket.io');

var app=express();

var http = require('http').Server(app);

var io = socket(http)
io.on('connection', function(socket){
		console.log('a user connected');
});

mongoose.connect('mongodb://localhost/passport');

//var user=require('./controllers/user');

require('./config/passport')(io);

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(session({
	secret:'mysecretsessionkey',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//require('./controllers/user.js')(app, passport);
 
// var foobar = user(io);

app.use(user(io));


http.listen(4000,function(){
 	console.log('listening on 4000');
 });
// server.js

// set up ======================================================================
var express 		= require('express');
var app 		= express(); 			// create app w/ express
var mongoose 		= require('mongoose'); 		// mongoose for mongodb
var port 		= process.env.PORT || 8080; 	// set port
var passport 		= require('passport');
var flash 		= require('connect-flash');

// express modules
var morgan 		= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var methodOverride 	= require('method-override');
var session 		= require('express-session');


// configuration ===============================================================
var configDB = require('./config/database'); 	// load the database config
mongoose.connect(configDB.url); 		// connect to mongoDB database on modulus.io
require('./config/passport')(passport);

// express config
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');
// required for passport
app.use(session({ 	secret: 'bigtombigtombigtom',
					saveUninitialized: true,
					resave: true})); 	// session config
app.use(passport.initialize());
app.use(passport.session()); 					// persistent login sessions
app.use(flash()); 						// use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

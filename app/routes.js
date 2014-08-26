// app/routes.js

// load models and resources
var Image = require('./models/image');
var User = require('./models/user');
var Tracker = require('./models/tracker');
var fs = require('fs');
var http = require('http');
var path = require('path');
var inspect = require('util').inspect;
var Busboy = require('busboy');
var os = require('os');

module.exports = function(app, passport){

//// SIMPLE VIEWS -------------------------------------------------------------------
	app.get('/', function(req, res) {
		res.render('index.html', {
			user : req.user
		});
	});

	// login page
	app.get('/login', function(req, res){
		res.render('index.html', {
			user : req.user
		});
	});
	
	// upload page
	app.get('/upload', function(req, res){
		res.render('index.html', {
			user : req.user
		});
	});

	// location page
	app.get('/location/:loc_id', function(req, res){
		res.render('index.html', {
			user : req.user
		});
	});

	// profile page
	app.get('/profile', function(req, res){
		res.render('index.html', {
			user : req.user
		});
	});

	// load user profile and associated data
	app.get('/profile/info', function(req, res){
		Image.find({
			'_id': {$in: req.user.images}
		},	function(err, ups){
			Image.find({
				'_id': {$in: req.user.favorites}
			}, function(err, favs){
				res.json({
					uploads		: ups,
					favorites	: favs,
				});
			});
		});
	});

	// test page (for debugging)
	app.get('/test', function(req, res){
		console.log("test");
		res.json("test result");
	});

//// AUTHENTICATION ----------------------------------------------------------

	// logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
 	/*
	// login page
	app.get('/login', function(req, res){
		res.render('login.html', {
			user : req.user
		});
	}); */

	// FACEBOOK AUTHENTICATION -------------------
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	
	// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNTS) ---------

	// Facebook -------------------------------
	// send to facebook to do the authentication
	app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	// UNLINK ACCOUNTS

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

//// IMAGES ---------------------------------------------------------------------

	// Get
	app.get('/images', function(req, res) {
		// find and return all images
		Image.find(function(err, imgs) {
			if (err)
				res.send(err)
			res.json(imgs); 
		});
	});

	// Get all images for a single location for its page
	app.get('/location/imgs/:location_name', function(req, res){
		console.log(req.params.location_name);
		Image.find({
			'name': req.params.location_name
		},	function(err, imgs){
			if (imgs.length < 1){
				res.json(500, {error: 'location not found'});
			} else {
				res.json(imgs);
			}
		});
	});

	// Upload image and create an image object for it in the database
	app.post('/upload', function(req, res){
		var busboy = new Busboy({headers: req.headers});

		//Find an open name for file save path
		Tracker.findOne({name: 'main'}, function(err, main){
			var savePath;
			var index;
			var arr = main.imgs;
			var i = findOpenIndex(arr);
			if (i > -1){
				arr[i] = true;
				index = i.toString();
			}else{
				arr.push(true);
				index = (arr.length - 1).toString();
			} 

			Tracker.findOneAndUpdate({name: 'main'}, {imgs: arr}, function(err, main1){
				//console.log(main1.imgs);
			}); 

			busboy.on('file', function(fieldname, file, filename, encoding, mimetype){

				console.log('File [' + fieldname + ']: filename: ' + filename);
				file.on('data', function(data) {
	      		});
	      		file.on('end', function() {
	        		console.log('File [' + fieldname + ']: uploaded');
				});

	      		savePath = ('./public/uploads/' + index + path.extname(filename));
	      		//console.log(savePath);
				//savePath = path.join(os.tmpDir(), path.basename(filename)); 	//local save
				//savePath = './public/uploads/' + path.basename(filename);		//save to server
				file.pipe(fs.createWriteStream(savePath));
			});
			busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
	      		console.log('Field [' + fieldname + ']: value: ' + inspect(val));
	      		req.body[fieldname] = val;
	    	});
	    	busboy.on('finish', function() {
	      		console.log('Done parsing form!');
	      		var savedPath = savePath.substr(8); // edit url (cut off './public')
	      		console.log('Image saved to ' + savedPath);
	      		// create the image in the database
	      		Image.create({
					name 		: req.body.name,
					city		: req.body.city,
					state		: req.body.state,
					dateAdded 	: Date.now(),
					favorites	: 0,
					url			: savedPath,
					authorId 	: req.user.facebook.id,
					authorName	: req.user.facebook.name,
					done 		: false
				}, function(err, img) {
					if (err)
						res.send(err);
					// add the image's id to its uploader's profile
					User.update({"facebook.id": req.user.facebook.id},
						{$push: {"images": img._id}}, function(err, data){
						if (err)
							res.send(err);
						res.writeHead(303, { Connection: 'close', Location: '/' });
	      				res.end();
					});
				});
	   		});
	   		req.pipe(busboy);
   		});
	});

	// Add an image to favorites
	app.put('/images/favorites/add', function(req, res){
		// Increment the favorite count
		Image.findOneAndUpdate({
			_id: req.body._id
		}, {
			favorites : req.body.favorites
		}, function(err, img){
			// Add the image id to user's favorites
			User.update({"facebook.id": req.user.facebook.id},
				{$push: {"favorites": img._id}}, function(err){
				if (err)
					res.send(err);
				res.json(img);
				/*
				// find and return all images
				Image.find(function(err, imgs) {
					if (err)
						res.send(err)
					res.json(imgs);
				}); */
			});
		});
	});

	// Remove an image from favorites
	app.put('/images/favorites/remove', function(req, res){
		// Decrement the favorite count
		Image.findOneAndUpdate({
			_id: req.body._id
		}, {
			favorites : req.body.favorites
		}, function(err, img){
			// Remove the image id from user's favorites
			User.update({"facebook.id": req.user.facebook.id},
				{$pull: {"favorites": img._id}}, function(err){
				if (err)
					res.send(err);
				res.json(img);
				/*
				// find and return all images
				Image.find(function(err, imgs) {
					if (err)
						res.send(err)
					res.json(imgs);
				}); */
			});
		});
	});

	// delete an image (from home page- used only for debugging)
	app.delete('/images/:img_id', function(req, res) {
		// access the image data 
		Image.findOne({
			_id: req.params.img_id
		}, function(err, img){
			if (err)
				res.send(err);
			// remove the image from its uploader's 'images' array
			User.update({"facebook.id": img.authorId},
			{$pull: {"images": img._id}}, function(err, data){
				if (err)
					res.send(err);
				// remove the image from the database
				Image.remove({
					_id: req.params.img_id
				}, function(err, img){
					if (err)
						res.send(err);
					// find and return all remaining images
					Image.find(function(err, imgs){
						if (err)
							res.send(err);
						res.json(imgs);
					});
				});
			});
		});
	});

//// USERS

	// Add an image from a user's favorites  ---add here redundat??
	app.post('/users/favorites/add/:img_id', function(req, res){ 
		res.send(req.params.img_id);
	});

	// Remove an image from a user's favorites
	app.post('/users/favorites/remove/:img_id', function(req, res){ 
		res.send(req.params.img_id);
	});

	// delete an image (from profile page)
	app.delete('/users/uploads/:img_id', function(req, res) {
		User.update({"facebook.id": req.user._id},
			{$pull: {"images": req.params.img_id}
		}, function(err, data){
			if (err)
				res.send(err);
			// remove the image from the database
			Image.remove({
				_id: req.params.img_id
			}, function(err, img){
				if (err)
					res.send(err);
				// find and return all remaining images
				Image.find({
					'_id': {$in: req.user.images}
				},	function(err, ups){
					res.json(ups);
				});
			});
		}); 
	});

	// reset uploads (mainly for debugging)
	app.post('/users/reset', function(req, res){
		User.findOneAndUpdate(
			{"facebook.id": req.user.facebook.id},
			{"images": [], "favorites": []},
			function(err, user){
				if (err)
					res.send(err);
				console.log(user);
				res.json(user.images);
			});
	});

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}

/*
Tracker.findOne({name: 'main'}, function(err, main){
	console.log(main.imgs);
	var arr = main.imgs;
	
	arr = [];

	Tracker.findOneAndUpdate({name: 'main'}, {imgs: arr}, function(err, main1){
		console.log(main1.imgs);
	}); 
	
	//console.log(findOpenIndex(main.imgs));
});  */

function findOpenIndex(arr){
	for (var i = 0; i < arr.length; i++){
		if (arr[i] === false)
			return i;
	}
	return -1;
}
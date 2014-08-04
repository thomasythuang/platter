// app/routes.js

// load models and resources
var Image = require('./models/image');
var User = require('./models/user');
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

	// upload page
	app.get('/upload', function(req, res){
		res.render('upload.html', {
			user : req.user
		});
	});

//// AUTHENTICATION ----------------------------------------------------------

	// load user profile and associated data
	app.get('/profile', function(req, res){
		if (req.user){
			Image.find({
				'_id': {$in: req.user.images}
			},	function(err, ups){
				Image.find({
					'_id': {$in: req.user.favorites}
				}, function(err, favs){
					res.render('profile.html', {
						user 		: req.user,
						uploads		: ups,
						favorites	: favs,
					});
				});
			});
		} else {
			res.render('profile.html', {
				user 		: undefined,
				uploads 	: undefined,
				favorites	: undefined,
			});
		}
	});

	// logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// login page
	app.get('/login', function(req, res){
		res.render('login.html', {
			user : req.user
		});
	});

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
	/*
	// create image and send back all images after creation
	app.post('/images', function(req, res) {
		// create a todo, information comes from AJAX request from Angular
		Image.create({
			name 		: req.body.name,
			city		: req.body.city,
			state		: req.body.state,
			dateAdded 	: Date.now(),
			favorites	: 0,
			url			: "http://placehold.it/200x200",
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
				// find and return all images
				Image.find(function(err, imgs) {
					if (err)
						res.send(err)
					res.json(imgs);
				});
			});
		});
	});  */

	// Upload image and create an image object for it in the database
	app.post('/upload', function(req, res){
		var busboy = new Busboy({headers: req.headers});
		var savePath;

		busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
			console.log('File [' + fieldname + ']: filename: ' + filename);
			file.on('data', function(data) {
      		});
      		file.on('end', function() {
        		console.log('File [' + fieldname + ']: uploaded');
			});
			//savePath = path.join(os.tmpDir(), path.basename(filename)); 	//local save
			savePath = './public/uploads/' + path.basename(filename);		//save to server
			file.pipe(fs.createWriteStream(savePath));
		});
		busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      		console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      		req.body[fieldname] = val;
    	});
    	busboy.on('finish', function() {
      		console.log('Done parsing form!');
      		console.log('Image saved to ' + savePath);
      		// create the image in the database
      		Image.create({
				name 		: req.body.name,
				city		: req.body.city,
				state		: req.body.state,
				dateAdded 	: Date.now(),
				favorites	: 0,
				url			: savePath,
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
				// find and return all images
				Image.find(function(err, imgs) {
					if (err)
						res.send(err)
					res.json(imgs);
				});
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
				// find and return all images
				Image.find(function(err, imgs) {
					if (err)
						res.send(err)
					res.json(imgs);
				});
			});
		});
	});

	// delete an image
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
		res.send(req.params.img_id);
	});

	// reset uploads (mainly for debugging)
	app.post('/users/reset', function(req, res){
		User.findOneAndUpdate(
			{"facebook.id": req.user.facebook.id},
			{"images": []},
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
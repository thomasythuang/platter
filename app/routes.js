// app/routes.js

// load models and resources
var Image = require('./models/image');
var User = require('./models/user');
var fs = require('fs');
var http = require('http');
var inspect = require('util').inspect;
var multer = require('multer');
var os = require('os');
var cloudinary = require('cloudinary');

// cloudinary config
cloudinary.config({ 
  cloud_name: 'doge10k', 
  api_key: '954966425368312', 
  api_secret: 'Ko2uNmNgd8NpBuJdF4VC9ArzBqc' 
});

module.exports = function(app, passport){
	app.use(multer());

//// VIEWS -------------------------------------------------------------------
	// home page
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

	// (private) profile page
	app.get('/profile', function(req, res){
		res.render('index.html', {
			user : req.user
		});
	});

	// (public) profile page
	app.get('/user/:user_id', function(req, res){
		res.render('index.html', {
			user : req.user
		});
	});

	// load private profile and associated data
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

	// load public profile and associated data
	app.get('/users/info/:user_id', function(req, res){
		User.findOne({
			'_id': req.params.user_id
		}, function(err, user){
			Image.find({
				'_id': {$in: user.images}
			},	function(err, ups){
				Image.find({
					'_id': {$in: user.favorites}
				}, function(err, favs){
					res.json({
						uploads		: ups,
						favorites	: favs,
						user  		: user,
					});
				});
			});
		});
	});

	// 404 error page
	app.get('/404', function(req, res){
		res.render('index.html', {
			user : req.user
		});
	});

//// AUTHENTICATION ----------------------------------------------------------

	// logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
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

	// Get all images for a single location for its page
	app.get('/location/imgs/:location_name', function(req, res){
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
		var ext = req.files.image.extension;
		console.log(req.files.image);
		if (ext != 'jpg' && ext != 'png' && ext != 'gif'){
			res.status(415).send({code:415, error: 'Unsupported file type', fmt: ext});
		}else if (req.files.image.size > 2000000){
			res.status(413).send({code:413, error: 'File size too large', size: req.files.image.size});
		}else{
			// Upload to cloudinary, then save image data to mongoDB databse
			cloudinary.uploader.upload(req.files.image.path,
				function(result) {
					console.log(result);
				  Image.create({
						name 				: req.body.name,
						city				: req.body.city,
						state				: req.body.state,
						dateAdded 	: Date.now(),
						favorites		: 0,
						thumb				: result.eager[0].url,
						url					: result.eager[1].url,
						cloudId			: result.public_id,
						authorId 		: req.user._id,
						authorName	: req.user.facebook.name,
						done 				: false
					}, function(err, img) {
						if (err)
							res.send(err);
						// add the image's id to its uploader's profile
						User.update({"facebook.id": req.user.facebook.id},
							{$push: {"images": img._id}}, function(err, data){
							if (err)
								res.send(err);
							res.json(img);
						});
					}); 
				}, {
					// Create both a thumbnail and main image via cloudinary tools
					eager: [{width: 200, height: 200, crop: "fill"},
									{width: 600, height: 450, crop: "limit"},]
				}
			); 
		}
	});

	// Edit an image's data
	app.put('/images/edit', function(req, res){
		Image.findOneAndUpdate({
			_id: req.body._id
		}, {
			name 				: req.body.name,
			city				: req.body.city,
			state				: req.body.state
		}, function(err, img){
			if (err)
				res.send(err);
			else
				res.json(img);
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
			});
		});
	});

	// delete an image from main gallery (debugging only)
	app.delete('/images/:img_id', function(req, res) {
		// access the image data 
		Image.findOne({
			_id: req.params.img_id
		}, function(err, img){
			if (err)
				res.send(err);
			// remove the image from its uploader's 'images' array
			User.findOneAndUpdate({"_id": img.authorId},
				{$pull: {"images": img._id}
			}, function(err, user){
				if (err)
					res.send(err);
				// remove the image file from cloudinary
				cloudinary.uploader.destroy(img.cloudId, function(result){
					console.log(result);
					// remove the image data from the MongoDB database
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
	});

//// USERS
	// Delete an image from owner's profile page
	app.delete('/users/uploads/:img_id', function(req, res){
		// access the image data 
		Image.findOne({
			_id: req.params.img_id
		}, function(err, img){
			if (err)
				res.send(err);
			// remove the image from its uploader's 'image' array
			User.findOneAndUpdate({"_id": req.user._id},
				{$pull: {"images": img._id}
			}, function(err, user){
				if (err){
					res.send(err);
				}else{
					// remove the image file from cloudinary
					cloudinary.uploader.destroy(img.cloudId, function(result){
						console.log(result);
						// remove the image data from the MongoDB database
						Image.remove({
							_id: req.params.img_id
						}, function(err, img){
							if (err){
								res.send(err);
							}else{
								Image.find({
									'_id': {$in: req.user.images}
								}, function(err, ups){
									res.json(ups);
								});
							}
						});
					});
				}
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

	app.get('*', function(req, res){
		res.redirect('/404');
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

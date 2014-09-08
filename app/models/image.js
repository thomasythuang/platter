// app/models/image.js

// load mongoose
var mongoose = require('mongoose');

// define the schema for the image model
var imgSchema = mongoose.Schema({
  name		: String,
	city		: String,
	state		: String,
	dateAdded	: Date,
	favorites	: Number,
	thumb  	: String,
	url			: String,
	cloudId : String,
	authorId	: String,
	authorName	: String,

	done 		: Boolean
});

// create and export the location model
module.exports = mongoose.model('Image', imgSchema);

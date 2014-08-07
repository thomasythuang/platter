// app/models/tracker.js

// Keeps track of uploads to dynamically generate image save paths

// load mongoose
var mongoose = require('mongoose');

// define the schema for the image model
var trackSchema = mongoose.Schema({
	name		: String,
    imgs		: Array,

	done 		: Boolean
});

// create and export the location model
module.exports = mongoose.model('Tracker', trackSchema);

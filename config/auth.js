// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1447136428882176', // your App ID
		'clientSecret' 	: '7985b61a32cb6f274cf14c081cc40c25', // your App Secret
		//'callbackURL' 	: 'http://platter.herokuapp.com/auth/facebook/callback'
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},
	
};

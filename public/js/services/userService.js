// js/services/userService.js

var app = angular.module('userService', []);

app.factory('Users', function($http){
	return{

		addFav: function(imgId){
			return $http.post('/users/favorites/add/' + imgId);
		},
		removeFav: function(imgId){
			return $http.post('/users/favorites/remove/' + imgId);
		},
		deleteUpload: function(imgId){
			return $http.delete('/users/uploads/' + imgId);
		},
		reset: function(){
			return $http.post('/users/reset');
		},

	}
})
// js/services/mainService.js

var app = angular.module('mainService', []);

app.factory('Images', function($http){
	return{
		get: function(){
			return $http.get('/images');
		},
		delete: function(imgId){
			return $http.delete('/images/' + imgId);
		},
		addFav: function(img){
			return $http.put('/images/favorites/add', img);
		},
		rmvFav: function(img){
			return $http.put('/images/favorites/remove', img);
		},
	}
});

app.factory('Users', function($http){
	return{
		getInfo: function(){
			return $http.get('/profile/info');
		},
		deleteUpload: function(imgId){
			return $http.delete('/users/uploads/' + imgId);
		},
		reset: function(){
			return $http.post('/users/reset');
		},
	}
});